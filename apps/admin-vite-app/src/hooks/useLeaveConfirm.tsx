import { useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export function useLeaveConfirm(isDirty: boolean, message: string = "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này?") {
  const bypassRef = useRef(false);

  // Reset bypass when user makes new edits after a save
  useEffect(() => {
    if (isDirty) bypassRef.current = false;
  }, [isDirty]);

  // Prevent closing the browser tab / reloading
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);

  // Prevent internal navigation (React Router)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !bypassRef.current && isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  const markSaved = () => { bypassRef.current = true; };

  const UnsavedChangesModal = () => {
    return (
      <ConfirmModal
        isOpen={blocker.state === 'blocked'}
        onOpenChange={(open) => {
          if (!open && blocker.state === 'blocked') {
            blocker.reset();
          }
        }}
        title="Cảnh báo thay đổi chưa lưu"
        description={message}
        onConfirm={() => {
          if (blocker.state === 'blocked') {
            blocker.proceed();
          }
        }}
      />
    );
  };

  return { UnsavedChangesModal, markSaved };
}
