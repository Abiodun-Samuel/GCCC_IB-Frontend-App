import { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/modal/Modal';
import InputForm from '@/components/form/useForm/InputForm';
import TextAreaForm from '@/components/form/TextAreaForm';
import { Toast } from '@/lib/toastify';
import { useSendMessage } from '@/queries/message.query';

const SendMessageModal = memo(({ isOpen, onClose, recipient }) => {
  const { mutateAsync, isPending } = useSendMessage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', defaultValues: { subject: '', body: '' } });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = useCallback(
    async (data) => {
      if (!data.body?.trim()) {
        Toast.error('Please enter a message');
        return;
      }
      try {
        await mutateAsync({
          recipient_id: recipient?.id,
          subject: data.subject?.trim() || 'Birthday / Anniversary Wishes',
          body: data.body.trim(),
        });
        onClose();
        reset();
        Toast.success(`Message sent to ${recipient?.first_name}!`);
      } catch {
        // useSendMessage surfaces the error toast itself.
      }
    },
    [recipient, mutateAsync, reset, onClose]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Send Wishes to ${recipient?.first_name ?? ''} ${recipient?.last_name ?? ''}`}
      description="Share your blessings and encouragement"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
        <InputForm
          label="Subject"
          name="subject"
          register={register}
          placeholder="e.g. Happy Birthday!"
          error={errors.subject?.message}
        />
        <TextAreaForm
          label="Message"
          name="body"
          required
          register={register}
          placeholder="Type your wishes here..."
          rows={5}
          error={errors.body?.message}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline-light" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isPending}
            disabled={!isValid}
            startIcon={<Send size={13} />}
          >
            Send Message
          </Button>
        </div>
      </form>
    </Modal>
  );
});
SendMessageModal.displayName = 'Celebrations.SendMessageModal';

export default SendMessageModal;
