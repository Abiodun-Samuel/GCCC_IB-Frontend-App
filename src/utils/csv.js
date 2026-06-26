/**
 * CSV utilities
 * ─────────────────────────────────────────────────────────────
 * Lightweight, dependency-free CSV parsing helpers.
 *
 * The parser handles the common CSV edge cases we care about:
 *  - quoted fields containing commas, quotes ("") and newlines
 *  - CRLF / LF line endings
 *  - a UTF-8 BOM at the start of the file
 *  - trailing blank lines
 *
 * It is intentionally small — for heavier needs reach for a library
 * such as papaparse. Kept here so the email-upload flow has no new deps.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Strip a leading UTF-8 byte-order-mark if present.
 * @param {string} text
 * @returns {string}
 */
const stripBom = (text) => (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);

/**
 * Parse raw CSV text into an array of rows, where each row is an array
 * of string cells. Respects RFC-4180 style quoting.
 *
 * @param {string} text - Raw CSV file contents
 * @returns {string[][]} - Rows of cells
 */
export const parseCsv = (text) => {
    if (typeof text !== 'string' || text.length === 0) return [];

    const input = stripBom(text);
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < input.length; i += 1) {
        const char = input[i];
        const next = input[i + 1];

        if (inQuotes) {
            if (char === '"' && next === '"') {
                field += '"';
                i += 1; // skip the escaped quote
            } else if (char === '"') {
                inQuotes = false;
            } else {
                field += char;
            }
            continue;
        }

        if (char === '"') {
            inQuotes = true;
        } else if (char === ',') {
            row.push(field);
            field = '';
        } else if (char === '\n' || char === '\r') {
            // Handle CRLF as a single line break
            if (char === '\r' && next === '\n') i += 1;
            row.push(field);
            rows.push(row);
            row = [];
            field = '';
        } else {
            field += char;
        }
    }

    // Flush the final field/row (file may not end with a newline)
    if (field.length > 0 || row.length > 0) {
        row.push(field);
        rows.push(row);
    }

    return rows;
};

/**
 * Validate a single email address.
 * @param {string} value
 * @returns {boolean}
 */
export const isValidEmail = (value) =>
    typeof value === 'string' && EMAIL_PATTERN.test(value.trim());

/**
 * Read a File object as text using the FileReader API.
 * @param {File} file
 * @returns {Promise<string>}
 */
export const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
        reader.readAsText(file);
    });

/**
 * Extract emails from raw CSV text.
 *
 * Looks for a header column titled "email" (case-insensitive, trimmed)
 * and returns the de-duplicated, validated, lower-cased addresses from
 * that column. Falls back gracefully and reports any issues so the caller
 * can surface them to the user.
 *
 * @param {string} text - Raw CSV file contents
 * @returns {{ emails: string[], invalid: string[], error: string|null }}
 */
export const extractEmailsFromCsv = (text) => {
    const rows = parseCsv(text).filter(
        (cells) => cells.some((cell) => cell.trim() !== '')
    );

    if (rows.length === 0) {
        return { emails: [], invalid: [], error: 'The CSV file is empty.' };
    }

    const header = rows[0].map((cell) => cell.trim().toLowerCase());
    const emailIndex = header.indexOf('email');

    if (emailIndex === -1) {
        return {
            emails: [],
            invalid: [],
            error: 'No "email" column found. Add a header row with a column titled "email".',
        };
    }

    const seen = new Set();
    const emails = [];
    const invalid = [];

    for (let i = 1; i < rows.length; i += 1) {
        const raw = (rows[i][emailIndex] ?? '').trim();
        if (raw === '') continue;

        const normalized = raw.toLowerCase();

        if (!isValidEmail(normalized)) {
            invalid.push(raw);
            continue;
        }
        if (seen.has(normalized)) continue;

        seen.add(normalized);
        emails.push(normalized);
    }

    if (emails.length === 0) {
        return {
            emails,
            invalid,
            error: 'No valid email addresses were found in the "email" column.',
        };
    }

    return { emails, invalid, error: null };
};
