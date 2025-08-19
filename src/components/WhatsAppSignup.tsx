/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FacebookLoginResponse } from '@/types/facebook';
import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { getUserProfileThunk } from '@/store/slices/userSlice';
import type { EmbeddedSignupPayload } from '@/types/whatsAppES';
import { createEmbeddedSignup } from '@/api/endpoints/whatsappES';

const WhatsAppSignupButton: React.FC = () => {
  const [phoneNumberId, setPhoneNumberId] = useState<string | null>(null);
  const [wabaId, setWabaId] = useState<string | null>(null);

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

  // Configure your Facebook app settings here
  const config = {
    appId: import.meta.env.VITE_WHATSAPP_APP_ID,
    graphApiVersion: import.meta.env.VITE_WHATSAPP_GRAPH_API_VERSION,
    configurationId: import.meta.env.VITE_WHATSAPP_CONFIGURATION_ID,
    featureType: '', // Replace with your Feature Type
  };

  const dispatch = useAppDispatch();

  const handleEmbeddedSignup = async (payload: EmbeddedSignupPayload) => {
    try {
      await createEmbeddedSignup(payload);
      // After successful signup, fetch the updated user info
      dispatch(getUserProfileThunk());
    } catch (error) {
      // Handle error (show toast, etc.)
      console.error('Embedded signup failed:', error);
    }
  };

  const checkAndSendData = () => {
    const { code, phoneNumberId, wabaId } = signupDataRef.current;

    if (code && phoneNumberId && wabaId) {
      handleEmbeddedSignup({ shortLivedToken: code, phoneNumberId, wabaId });

      // Reset the ref data after sending
      signupDataRef.current = {
        code: null,
        phoneNumberId: null,
        wabaId: null,
      };
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

    // Initialize Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: config.appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: config.graphApiVersion,
      });
    };

    // Set up message event listener for WhatsApp signup
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.endsWith('facebook.com')) return;

      try {
        const data = JSON.parse(event.data);

        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          if (data.event === 'CANCEL') {
            console.log('WhatsApp signup cancelled');
          } else if (data.event === 'FINISH') {
            const tempPhoneNumberId = data.data?.phone_number_id;
            const tempWabaId = data.data?.waba_id;

            // Update state for UI
            setPhoneNumberId(tempPhoneNumberId);
            setWabaId(tempWabaId);

            // Update ref for backend sending
            signupDataRef.current.phoneNumberId = tempPhoneNumberId;
            signupDataRef.current.wabaId = tempWabaId;

            // Check if we have all data and send to backend
            checkAndSendData();
          }
        }
      } catch {
        // Ignore JSON parse errors
      }
    };

    window.addEventListener('message', handleMessage);
    loadFacebookSDK();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []); // Empty dependency array - runs only once

  const launchWhatsAppSignup = () => {
    const fbLoginCallback = (response: FacebookLoginResponse) => {
      if (response.authResponse?.code) {
        console.log(
          'Facebook login successful with code:',
          response.authResponse.code
        );

        // Store code in ref
        signupDataRef.current.code = response.authResponse.code;

        // Check if we have all data and send to backend
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
      console.error('Facebook SDK not loaded');
      handleError('Facebook SDK not loaded');
    }
  };

  const handleError = (error: any) => {
    console.error('WhatsApp signup failed:', error);
    // Add your error handling logic here
    // For example: show error message to user
  };

  const handleClick = () => {
    launchWhatsAppSignup();
  };

  return (
    <div>
      <button
        onClick={handleClick}
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
      {phoneNumberId && wabaId && (
        <div>
          <p>Phone Number ID: {phoneNumberId}</p>
          <p>WABA ID: {wabaId}</p>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSignupButton;
