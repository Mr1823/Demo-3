import React, { useState } from 'react';
import useUserInfo from '../../../hooks/useUserInfo';

const AccountDetails = () => {
  const [userFromDB, isUserLoading, refetch] = useUserInfo();
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h2 className="font-headline-md text-headline-md text-primary mb-2">Account Details</h2>
        <p className="font-body-base text-on-surface-variant">Manage your personal profile and security preferences.</p>
      </div>

      <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
        {/* Form Group: Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="space-y-1">
            <label className="font-label-caps text-label-caps text-outline uppercase block">Full Name</label>
            <input 
              className="border-0 border-b border-outline-variant bg-transparent w-full py-3 transition-colors outline-none focus:ring-0 focus:border-primary font-body-base text-on-surface" 
              placeholder="Your full name" 
              type="text" 
              defaultValue={userFromDB?.name || ''} 
            />
          </div>
          <div className="space-y-1">
            <label className="font-label-caps text-label-caps text-outline uppercase block">Phone Number</label>
            <input 
              className="border-0 border-b border-outline-variant bg-transparent w-full py-3 transition-colors outline-none focus:ring-0 focus:border-primary font-body-base text-on-surface" 
              placeholder="Your contact number" 
              type="tel" 
              defaultValue={userFromDB?.phone || ''} 
            />
          </div>
        </div>

        {/* Form Group: Communication */}
        <div className="space-y-1">
          <label className="font-label-caps text-label-caps text-outline uppercase block">Email Address</label>
          <input 
            className="border-0 border-b border-outline-variant bg-transparent w-full py-3 transition-colors outline-none focus:ring-0 focus:border-primary font-body-base text-on-surface opacity-70 cursor-not-allowed" 
            placeholder="email@example.com" 
            type="email" 
            value={userFromDB?.email || ''}
            disabled 
          />
        </div>

        {/* Decorative Divider */}
        <div className="py-8 flex justify-center">
          <div className="w-16 h-[1px] bg-outline-variant"></div>
        </div>

        {/* Security Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Security</h3>
              <p className="text-body-base text-on-surface-variant text-sm">Manage your account access and credentials.</p>
            </div>
            <button 
              className="text-primary font-bold text-sm hover:underline transition-all" 
              onClick={() => setShowPasswordFields(!showPasswordFields)} 
              type="button"
            >
              Change Password
            </button>
          </div>

          {/* Expandable Password Fields */}
          {showPasswordFields && (
            <div className="space-y-8 mt-4 animate-in fade-in duration-500">
              <div className="space-y-1">
                <label className="font-label-caps text-label-caps text-outline uppercase block">Current Password</label>
                <input 
                  className="border-0 border-b border-outline-variant bg-transparent w-full py-3 transition-colors outline-none focus:ring-0 focus:border-primary font-body-base text-on-surface" 
                  placeholder="••••••••" 
                  type="password" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="space-y-1">
                  <label className="font-label-caps text-label-caps text-outline uppercase block">New Password</label>
                  <input 
                    className="border-0 border-b border-outline-variant bg-transparent w-full py-3 transition-colors outline-none focus:ring-0 focus:border-primary font-body-base text-on-surface" 
                    placeholder="Min. 8 characters" 
                    type="password" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label-caps text-label-caps text-outline uppercase block">Confirm New Password</label>
                  <input 
                    className="border-0 border-b border-outline-variant bg-transparent w-full py-3 transition-colors outline-none focus:ring-0 focus:border-primary font-body-base text-on-surface" 
                    placeholder="Repeat new password" 
                    type="password" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="pt-12 flex flex-col md:flex-row items-center gap-6">
          <button 
            className="w-full md:w-auto bg-primary text-white font-button-text text-button-text px-12 py-4 rounded-none hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm" 
            type="submit"
          >
            SAVE CHANGES
          </button>
        </div>
      </form>

      {/* Secondary Info Cards (Bento style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-section-gap-sm">
        <div className="p-8 border border-outline-variant/30 bg-surface-container-low">
          <span className="material-symbols-outlined text-primary mb-4">verified_user</span>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2">Two-Factor Auth</h4>
          <p className="text-body-base text-on-surface-variant text-sm mb-6">Enhance your account security with an extra layer of protection.</p>
          <button className="text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity uppercase tracking-widest font-label-caps text-[10px]">ENABLE NOW</button>
        </div>
        <div className="p-8 border border-outline-variant/30 bg-surface-container-low">
          <span className="material-symbols-outlined text-primary mb-4">mail</span>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2">Preferences</h4>
          <p className="text-body-base text-on-surface-variant text-sm mb-6">Manage how you receive updates on our latest artisanal collections.</p>
          <button className="text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity uppercase tracking-widest font-label-caps text-[10px]">MANAGE EMAILS</button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
