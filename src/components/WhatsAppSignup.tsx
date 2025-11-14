/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FacebookLoginResponse } from '@/types/facebook';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { getUserProfileThunk } from '@/store/slices/userSlice';
import type { EmbeddedSignupPayload } from '@/types/whatsAppES';
import { createEmbeddedSignup } from '@/api/endpoints/whatsappES';

const WhatsAppSignupButton: React.FC = () => {
  // ⚡ loader state for UI
  const [signupLoading, setSignupLoading] = useState(false);

  // Use ref to store data that doesn't cause re-renders
  const signupDataRef = useRef<{
    code: string | null;
    phoneNumberId: string | null;
    wabaId: string | null;
  }>({
    code: null,
    phoneNumberId: null,
    wabaId: null,
  });

  const config = {
    appId: import.meta.env.VITE_WHATSAPP_APP_ID,
    graphApiVersion: import.meta.env.VITE_WHATSAPP_GRAPH_API_VERSION,
    configurationId: import.meta.env.VITE_WHATSAPP_CONFIGURATION_ID,
    featureType: '', // Add if needed
  };

  const dispatch = useAppDispatch();

  const handleEmbeddedSignup = async (payload: EmbeddedSignupPayload) => {
    try {
      await createEmbeddedSignup(payload);

      // Backend will take some time → keep loader ON
      await dispatch(getUserProfileThunk());
    } catch (error) {
      console.error('Embedded signup failed:', error);
      setSignupLoading(false); // ❗Stop loader on error
    }
  };

  const checkAndSendData = () => {
    const { code, phoneNumberId, wabaId } = signupDataRef.current;

    if (code && phoneNumberId && wabaId) {
      handleEmbeddedSignup({ shortLivedToken: code, phoneNumberId, wabaId });

      // Reset after sending
      signupDataRef.current = { code: null, phoneNumberId: null, wabaId: null };
    }
  };

  useEffect(() => {
    // Load Facebook SDK
    const loadFacebookSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    };

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: config.appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: config.graphApiVersion,
      });
    };

    // Listen for WA signup messages
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.endsWith('facebook.com')) return;

      try {
        const data = JSON.parse(event.data);

        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          if (data.event === 'CANCEL') {
            console.log('WhatsApp signup cancelled');
            setSignupLoading(false);
          } else if (data.event === 'FINISH') {
            const phoneNumberId = data.data?.phone_number_id;
            const wabaId = data.data?.waba_id;

            signupDataRef.current.phoneNumberId = phoneNumberId;
            signupDataRef.current.wabaId = wabaId;

            // ⭐ Show loader instantly
            setSignupLoading(true);

            checkAndSendData();
          }
        }
      } catch {
        // ignore invalid JSON
      }
    };

    window.addEventListener('message', handleMessage);
    loadFacebookSDK();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const launchWhatsAppSignup = () => {
    const fbLoginCallback = (response: FacebookLoginResponse) => {
      if (response.authResponse?.code) {
        signupDataRef.current.code = response.authResponse.code;

        // ⭐ Immediate loader on success
        setSignupLoading(true);

        checkAndSendData();
      } else {
        console.log('Facebook login failed:', response);
        handleError(response);
      }
    };

    if (window.FB) {
      window.FB.login(fbLoginCallback, {
        config_id: config.configurationId,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: config.featureType,
          sessionInfoVersion: '3',
        },
      });
    } else {
      handleError('Facebook SDK not loaded');
    }
  };

  const handleError = (error: any) => {
    console.error('WhatsApp signup failed:', error);
    setSignupLoading(false);
  };

  return (
    <div>
      {signupLoading ? (
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <span className="text-gray-700 font-medium">Finishing setup…</span>
        </div>
      ) : (
        <button
          onClick={launchWhatsAppSignup}
          style={{
            backgroundColor: '#1877f2',
            border: 0,
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '16px',
            fontWeight: 'bold',
            height: '40px',
            padding: '0 24px',
          }}
        >
          Login with Facebook
        </button>
      )}
    </div>
  );
};

export default WhatsAppSignupButton;
