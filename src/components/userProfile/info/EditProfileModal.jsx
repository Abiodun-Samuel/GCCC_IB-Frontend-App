import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Country, State } from 'country-state-city';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/modal/Modal';
import InputForm from '@/components/form/useForm/InputForm';
import RadioForm from '@/components/form/useForm/RadioForm';
import SingleSelectForm from '@/components/form/useForm/SingleSelectForm';
import { profileSchema } from '@/schema';
import { useAuthStore } from '@/store/auth.store';
import { useUpdateProfile } from '@/queries/user.query';
import TextAreaForm from '@/components/form/TextAreaForm';
import Message from '@/components/common/Message';
import { formatBirthDate } from '@/utils/helper';
import dayjs from 'dayjs';


const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];


const EditProfileModal = ({ isOpen, onClose }) => {
  const { mutate: updateProfile, isPending, isError, error } = useUpdateProfile({
    onSuccess: () => onClose(),
  });

  const { user } = useAuthStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
      whatsapp_phone: user?.whatsapp_phone || '',
      gender: user?.gender || '',
      date_of_birth: user?.date_of_birth ? dayjs(user?.date_of_birth).format("DD/MM") : '',
      country: user?.country || '',
      city_or_state: user?.city_or_state || '',
      address: user?.address || '',
    },
  });


  const handleFormSubmit = (data) => {
    const payload = { ...data, date_of_birth: formatBirthDate(data.date_of_birth) }
    updateProfile(payload);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Edit Personal Information"
      description="Update your details to keep your profile current and accurate."
      onClose={handleClose}
      size="2xl"
    >
      <ProfileForm
        onSubmit={handleSubmit(handleFormSubmit)}
        register={register}
        errors={errors}
        isPending={isPending}
        onClose={handleClose}
        watch={watch}
        setValue={setValue}
        isError={isError}
        error={error}
        user={user}
      />
    </Modal>
  );
};


const ProfileForm = ({ user, onSubmit, register, errors, isPending, onClose, watch, setValue, isError,
  error }) => {
  const countries = useMemo(() =>
    Country.getAllCountries().map(country => ({
      text: country.name,
      value: country.name,
      isoCode: country.isoCode,
    })),
    []
  );

  // Watch country and state selections
  const selectedCountryName = watch('country');

  // Get selected country object
  const selectedCountry = useMemo(
    () => Country.getAllCountries().find(c => c.name === selectedCountryName),
    [selectedCountryName]
  );

  // Get states for selected country
  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode).map(state => ({
      text: state.name,
      value: state.name,
      isoCode: state.isoCode,
    }));
  }, [selectedCountry]);


  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputForm
            label="First Name"
            name="first_name"
            type="text"
            placeholder="John"
            register={register}
            error={errors.first_name?.message}
          />
          <InputForm
            label="Last Name"
            name="last_name"
            type="text"
            placeholder="Doe"
            register={register}
            error={errors.last_name?.message}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputForm
            label="Phone Number (Call & Text)"
            name="phone_number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            register={register}
            error={errors.phone_number?.message}
          />

          <InputForm
            label="Phone Number (Whatsapp)"
            name="whatsapp_number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            register={register}
            error={errors.whatsapp_number?.message}
          />

          <InputForm
            label="Date of Birth"
            name="date_of_birth"
            type="text"
            placeholder="DD/MM (e.g., 23/09)"
            register={register}
            error={errors.date_of_birth?.message}
            helpText="Enter day and month only"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SingleSelectForm
            label="Country"
            name="country"
            placeholder="Select your country"
            options={countries}
            register={register}
            defaultValue={user?.country}
            error={errors.country?.message}
            setValue={setValue}
            required
          />
          <SingleSelectForm
            label="State / Region"
            name="city_or_state"
            placeholder={selectedCountry ? 'Select your state/region' : 'Select a country first'}
            options={states}
            register={register}
            defaultValue={user?.city_or_state}
            error={errors.city_or_state?.message}
            setValue={setValue}
            disabled={!selectedCountry || states.length === 0}
            required
          />
        </div>

        <RadioForm
          label="Gender"
          name="gender"
          type="radio"
          layout="grid"
          register={register}
          error={errors.gender?.message}
          options={GENDER_OPTIONS}
          required
        />

        <TextAreaForm
          label="Street Address"
          name="address"
          type="text"
          placeholder="123 Main Street"
          register={register}
          error={errors.address?.message}
          required
        />
      </div>

      {isError && <Message variant='error' data={error?.data} />}

      <div className="flex gap-3 pt-5 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isPending}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isPending}
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileModal;