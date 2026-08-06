'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { CreateLeadSchema } from 'shared-api';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

type ContactFormValues = z.infer<typeof CreateLeadSchema>;

export default function ContactForm({
  productId,
  productName,
  jobId,
  jobTitle,
  defaultMessage,
}: {
  productId?: string;
  productName?: string;
  jobId?: string;
  jobTitle?: string;
  defaultMessage?: string;
}) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(CreateLeadSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      message: defaultMessage || '',
      targetProductId: productId || '',
      targetJobId: jobId || '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.leads.submitLead({
        ...data,
        email: data.email || undefined,
        targetProductId: data.targetProductId || undefined,
        targetJobId: data.targetJobId || undefined,
      });
      setIsSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      setError(t('contact.form_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#f8fafd] rounded-3xl border border-[#5e8dd1]/20 text-center animate-fade-in">
        <div className="w-16 h-16 bg-[#5e8dd1]/10 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5e8dd1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-[24px] font-semibold text-[#111] mb-2">{t('contact.success_heading')}</h3>
        <p className="text-gray-600 mb-8 max-w-md">
          {t('contact.success_body')}
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="secondary" size="lg">
          {t('contact.send_another')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[14px]">
          {error}
        </div>
      )}

      {productName && (
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl mb-2 flex items-start gap-3">
          <div className="shrink-0 mt-0.5 text-[#5e8dd1]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 m-0 mb-1">
              {t('contact.interested_product')}
            </p>
            <p className="text-[15px] font-medium text-[#111] m-0 leading-snug">
              {productName}
            </p>
          </div>
        </div>
      )}

      {jobTitle && (
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl mb-2 flex items-start gap-3">
          <div className="shrink-0 mt-0.5 text-[#5e8dd1]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 m-0 mb-1">
              {t('contact.applying_for')}
            </p>
            <p className="text-[15px] font-medium text-[#111] m-0 leading-snug">
              {jobTitle}
            </p>
          </div>
        </div>
      )}

      <input type="hidden" {...register('targetProductId')} />
      <input type="hidden" {...register('targetJobId')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label={t('contact.field_name')}
          placeholder={t('contact.field_name_placeholder')}
          required
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label={t('contact.field_phone')}
          type="tel"
          placeholder={t('contact.field_phone_placeholder')}
          required
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
      </div>

      <Input
        label={t('contact.field_email')}
        type="email"
        placeholder={t('contact.field_email_placeholder')}
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="text-[13px] text-gray-400 mt-[-16px] ml-1">{t('contact.optional')}</div>

      <Textarea
        label={t('contact.field_message')}
        rows={5}
        placeholder={t('contact.field_message_placeholder')}
        required
        error={errors.message?.message}
        {...register('message')}
      />

      <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-2 w-full">
        {t('contact.submit_button')}
      </Button>
    </form>
  );
}
