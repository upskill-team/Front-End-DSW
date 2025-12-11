import React from 'react';
import Input, { type InputProps } from './Input/Input';

interface ProfileFieldProps extends InputProps {
  isEditing: boolean;
  icon: React.ReactNode;
}

const ProfileField = React.forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ isEditing, icon, label, value, ...props }, ref) => {
    if (isEditing) {
      return <Input label={label} id={props.id} icon={icon} ref={ref} {...props} />;
    }

    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
        <div className="flex items-center h-[46px] w-full rounded-lg bg-slate-100/70 px-4">
          <span className="text-slate-400 mr-3">{icon}</span>
          <p className="text-slate-600">{value || 'No establecido'}</p>
        </div>
      </div>
    );
  }
);

ProfileField.displayName = 'ProfileField';
export default ProfileField;