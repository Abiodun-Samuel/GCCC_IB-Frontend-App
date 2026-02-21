import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import { useCreateFormMessages } from '@/queries/form.query';
import TextAreaForm from '@/components/form/TextAreaForm';
import { useAuthStore } from '@/store/auth.store';

export default function PrayerForm() {
  const { isAuthenticated, user } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useCreateFormMessages({
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data) => {
    const payload = {
      type: 'prayer',
      content: data.message,
      ...(isAuthenticated && user?.id ? { user_id: user.id } : {}),
    };
    mutate(payload);
  };

  return (
    <div className="space-y-5 mt-5 text-gray-800 dark:text-gray-100">
      <h3 className="text-[24px] font-bold text-[#24244e] dark:text-gray-100">
        Prayer Request
      </h3>

      <h3 className="text-sm mt-2 text-gray-700 dark:text-gray-300">
        Send your prayer request(s), knowing that whatever we ask in His name,
        He will do it. Let's together glorify the Father through the power of
        prayer.
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm"
      >
        <TextAreaForm
          label="What is your prayer request?"
          name="message"
          register={register}
          required={true}
          rows={6}
          cols={40}
          placeholder="Type your message here..."
          error={errors.message?.message}
        />

        <Button
          className="mt-5 w-full md:w-auto"
          type="submit"
          loading={isPending}
          size="md"
          variant="primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
