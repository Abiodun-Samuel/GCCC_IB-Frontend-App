import Switch from '@/components/form/Switch';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { CheckIcon, DeleteIcon, DownloadIcon, UserIcon } from '@/icons';
import { Toast } from '@/lib/toastify';
import { useAuthStore } from '@/store/auth.store';
import { getHighestRole } from '@/utils/auth.helpers';
import {
  DEFAULT_EXTENSION,
  MIME_TYPE_EXTENSIONS,
  ROLE_CONFIG,
  ROLE_CONFIGS,
} from '@/utils/data';
import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

const getRoleConfig = (role) => {
  const normalizedRole = role?.toLowerCase();
  return ROLE_CONFIG[normalizedRole] || ROLE_CONFIG.member;
};

const UserInfo = ({ user }) => {
  const primaryRole = getHighestRole(user.roles);
  const roleConfig = getRoleConfig(primaryRole);
  const isActive = user.status === 'active';

  return (
    <div className="truncate">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {user.full_name || 'N/A'}
      </h1>
      <Link
        to={`mailto:${user?.email}`}
        className="hover:underline text-sm block text-gray-500 dark:text-gray-400"
      >
        {user.email || 'No email provided'}
      </Link>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <Badge size="md" color={roleConfig.color}>
          {roleConfig.label}
        </Badge>
        {isActive ? (
          <Badge startIcon={<CheckIcon />} size="md" color="success">
            Active
          </Badge>
        ) : (
          <Badge startIcon={<DeleteIcon height={15} />} size="md" color="error">
            Deactivated
          </Badge>
        )}
        {user?.assigned_to_member && (
          <Badge color="primary" size="md">
            <UserIcon width={15} height={15} />{' '}
            {user?.assigned_to_member?.full_name}
          </Badge>
        )}
      </div>
    </div>
  );
};

const SettingsPanel = ({
  onToggleToolbox,
  onToggleProfile,
  showToolbox,
  showProfile,
}) => (
  <div className="space-y-2">
    <Switch
      onChange={onToggleToolbox}
      defaultChecked={showToolbox}
      label="Show Toolbox"
    />
    <Switch
      onChange={onToggleProfile}
      defaultChecked={showProfile}
      label="Show Profile"
    />
  </div>
);

export const ProfileHeader = ({
  user,
  onToggleToolbox,
  onToggleProfile,
  showToolbox,
  showProfile,
}) => {
  const { isAdmin, isLeader } = useAuthStore();

  const roleConfig = useMemo(() => {
    if (isAdmin) return ROLE_CONFIGS.admin;
    if (isLeader) return ROLE_CONFIGS.leader;
    return ROLE_CONFIGS.member;
  }, [isAdmin, isLeader]);
  const getFileExtension = useCallback((mimeType) => {
    return MIME_TYPE_EXTENSIONS[mimeType] || DEFAULT_EXTENSION;
  }, []);

  const sanitizeFileName = useCallback((fileName) => {
    return fileName.replace(/[^\w-]+/g, '');
  }, []);

  const generateFileName = useCallback(
    (imageUrl, userName, extension) => {
      const urlParts = imageUrl.split('/');
      const lastPart = urlParts[urlParts.length - 1].split('?')[0];
      const baseName = sanitizeFileName(
        userName || lastPart.split('.')[0] || 'download'
      );
      return `${baseName}.${extension}`;
    },
    [sanitizeFileName]
  );

  const triggerBlobDownload = useCallback((blob, fileName) => {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(blobUrl);
  }, []);

  const handleDownload = useCallback(
    async (imageUrl, userName) => {
      if (!imageUrl) {
        Toast.error('No image URL provided');
        return;
      }

      try {
        const response = await fetch(imageUrl, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const blob = await response.blob();
        const extension = getFileExtension(blob.type);
        const fileName = generateFileName(imageUrl, userName, extension);

        triggerBlobDownload(blob, fileName);

        Toast.success('Image downloaded successfully');
      } catch (error) {
        Toast.error(`Failed to download image: ${error}`);
      }
    },
    [getFileExtension, generateFileName, triggerBlobDownload]
  );
  const handleDownloadClick = useCallback(() => {
    handleDownload(user?.avatar, user?.full_name);
  }, [user?.avatar, user?.full_name, handleDownload]);

  if (!user) {
    return null;
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-start">
        <div className="relative">
          <Avatar
            size="3xl"
            shape="square"
            src={user.avatar}
            name={user.initials}
          />
          <button
            type="button"
            onClick={handleDownloadClick}
            className="absolute top-0 left-0"
            aria-label="Download avatar"
          >
            <DownloadIcon
              width={20}
              height={20}
              fill="transparent"
              className={`text-white cursor-pointer rounded-full w-8 h-8 p-2 bg-linear-to-br ${roleConfig.bgClass} dark:text-gray-300 flex items-center justify-center ring-4 ring-white dark:ring-gray-800 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </button>
        </div>
        <SettingsPanel
          onToggleToolbox={onToggleToolbox}
          onToggleProfile={onToggleProfile}
          showToolbox={showToolbox}
          showProfile={showProfile}
        />
      </div>
      <UserInfo user={user} />
    </div>
  );
};
