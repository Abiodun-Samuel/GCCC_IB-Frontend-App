import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { firstTimerSchema } from '../../schema/index';
import {
  Step1PersonalInfo,
  Step2FriendFamilyLocation,
  Step3Interest,
  Step4Details,
  Step5Experience,
} from '../../components/firstTimer/stepform';
import { useCreateFirstTimer } from '../../queries/firstTimer.query';
import Message from '../../components/common/Message';
import Button from '../../components/ui/Button';
import { Toast } from '../../lib/toastify';
import { formatBirthDate, handleApiError } from '../../utils/helper';
import { ProgressIndicator } from '@/components/firstTimer/ProgressIndicator';
import SuccessCompletion from '@/components/firstTimer/SuccessCompletion';
import HomepageComponentCard from '@/components/common/HomepageComponentCard';
import AnimatedBackground from '@/components/common/AnimatedBackground';

// Constants
const TOTAL_STEPS = 5;
const STEP_VALIDATION_FIELDS = {
  1: ['first_name', 'last_name', 'email', 'phone_number', 'gender'],
  2: ['how_did_you_learn'],
  3: ['membership_interest', 'located_in_ibadan'],
  4: ['address', 'date_of_birth', 'occupation', 'born_again'],
  5: ['service_experience', 'whatsapp_interest'],
};

const createFormPayload = (data) => {
  const howDidYouLearnValue = data.how_did_you_learn === 'other'
    ? data.how_did_you_learn_other_text?.trim()
    : data.how_did_you_learn;

  return {
    first_name: data.first_name,
    last_name: data.last_name,
    phone_number: data.phone_number || `${data.first_name}${data.last_name}${new Date().getTime()}`,
    email: data.email || `${data.first_name}${data.last_name}${new Date().getTime()}@gmail.com`,
    gender: data.gender,
    located_in_ibadan: data.located_in_ibadan,
    membership_interest: data.membership_interest,
    is_student: data?.occupation?.toLowerCase()?.includes('student'),
    born_again: data.born_again || null,
    whatsapp_interest: data.whatsapp_interest,
    address: data.address || null,
    date_of_birth: formatBirthDate(data.date_of_birth),
    date_of_visit: new Date().toISOString(),
    occupation: data.occupation || null,
    service_experience: data.service_experience,
    prayer_point: data.prayer_point || null,
    invited_by: data.invited_by || null,
    status: 'active',
    how_did_you_learn: howDidYouLearnValue,
  };
};

const FirstTimerPage = () => {
  const [step, setStep] = useState(1);

  const {
    mutateAsync: createFirstTimer,
    isPending,
    isError,
    error,
  } = useCreateFirstTimer();

  const form = useForm({
    resolver: yupResolver(firstTimerSchema),
    mode: 'onBlur',
  });

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const isCompleteStep = useMemo(() => step === 'complete', [step]);
  const isLastStep = useMemo(() => step === TOTAL_STEPS, [step]);


  const shouldShowStep4 = useCallback(() => {
    const membershipInterest = getValues('membership_interest');
    return membershipInterest !== 'No';
  }, [getValues]);


  const getValidationFields = useCallback(
    (currentStep) => {
      if (currentStep === 2) {
        const howDidYouLearn = getValues('how_did_you_learn');
        const baseFields = ['how_did_you_learn'];

        if (howDidYouLearn === 'other') {
          return [...baseFields, 'how_did_you_learn_other_text'];
        }
        if (howDidYouLearn === 'Friend/Family') {
          return [...baseFields, 'invited_by'];
        }

        return baseFields;
      }

      if (currentStep === 4) {
        const membershipInterest = getValues('membership_interest');

        if (membershipInterest !== 'No') {
          return ['address', 'date_of_birth', 'occupation', 'born_again'];
        }

        return [];
      }

      return STEP_VALIDATION_FIELDS[currentStep] || [];
    },
    [getValues]
  );

  const validateCurrentStep = useCallback(async () => {
    const fieldsToValidate = getValidationFields(step);

    if (fieldsToValidate.length === 0) return true;

    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      Toast.error(
        'Please fill in all required fields correctly before proceeding.'
      );
    }

    return isValid;
  }, [step, getValidationFields, trigger]);


  const getNextStep = useCallback(() => {
    if (step === 3) {
      const membershipInterest = getValues('membership_interest');
      if (membershipInterest === 'No') {
        return 5;
      }
      return 4;
    }
    return step + 1;
  }, [step, getValues]);


  const getPreviousStep = useCallback(() => {
    if (step === 5) {
      const membershipInterest = getValues('membership_interest');
      if (membershipInterest === 'No') {
        return 3;
      }
      return 4;
    }
    return Math.max(1, step - 1);
  }, [step, getValues]);

  const handleNextStep = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    setStep(getNextStep());
  }, [validateCurrentStep, getNextStep]);

  const handlePreviousStep = useCallback(() => {
    setStep(getPreviousStep());
  }, [getPreviousStep]);

  const handleFormSubmit = useCallback(
    async (data) => {
      try {
        const payload = createFormPayload(data);
        await createFirstTimer(payload);
        setStep('complete');
      } catch (err) {
        const message = handleApiError(err);
        Toast.error(`Form submission failed: ${message}`);
      }
    },
    [createFirstTimer]
  );

  const handleButtonClick = useCallback(async () => {
    if (isLastStep) {
      await handleSubmit(handleFormSubmit)();
    } else {
      await handleNextStep();
    }
  }, [isLastStep, handleSubmit, handleFormSubmit, handleNextStep]);

  const renderStepContent = () => {
    const stepComponents = {
      1: <Step1PersonalInfo register={register} errors={errors} />,
      2: (
        <Step2FriendFamilyLocation
          watch={watch}
          register={register}
          errors={errors}
          setValue={setValue}
        />
      ),
      3: <Step3Interest register={register} errors={errors} />,
      4: <Step4Details register={register} errors={errors} />,
      5: <Step5Experience register={register} errors={errors} />,
    };

    return stepComponents[step] || null;
  };

  const renderActionButtons = () => (
    <div
      className={`${step > 1 ? 'justify-between' : 'justify-end'
        } flex gap-4 border-t border-gray-200 dark:border-gray-700 pt-6 mt-6`}
    >
      {step > 1 && (
        <Button
          className="w-full flex-1"
          type="button"
          onClick={handlePreviousStep}
          variant="ghost"
          size="md"
        >
          Previous
        </Button>
      )}
      <Button
        className="w-full flex-1"
        type="button"
        loading={isPending}
        onClick={handleButtonClick}
        variant="primary"
        size="md"
      >
        {isLastStep ? 'Submit' : 'Next'}
      </Button>
    </div>
  );

  const renderCompletionMessage = () => (
    <SuccessCompletion />
  );

  const renderForm = () => (
    <>
      <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
      <form
        className="space-y-5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <div className="space-y-5">{renderStepContent()}</div>
        {isError && (
          <div className="mt-4">
            <Message variant="error" data={error?.data} />
          </div>
        )}
        {renderActionButtons()}
      </form>
    </>
  );

  return (
    <>
      <HomepageComponentCard>
        <div className="w-full md:max-w-3xl  mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-7">
            {isCompleteStep ? renderCompletionMessage() : renderForm()}
          </div>
        </div>
      </HomepageComponentCard>
    </>
  );
};

export default FirstTimerPage;