import React, { useCallback, useState, useEffect } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import {
  Heading,
  Form,
  Paragraph,
  Flex,
  TextInput,
  FormControl,
  Pill,
} from '@contentful/f36-components';
import { css } from 'emotion';
import { useSDK } from '@contentful/react-apps-toolkit';
import { ContentTypeProps } from 'contentful-management';

// Update these parameters to match those configured in your App Definition
export interface AppInstallationParameters {
  /*
   * Because the `apiKey` parameter is defined as type `Secret` in the Parameter Definition,
   * it will only be available as a redacted string on the frontend.
   * Save it as you would any other parameter, but remember that only the
   * App Identity (a Contentful Function or a backend app authenticating using the app's private App Key)
   * will be able to access the raw value to use it for API requests.
   */
  targetContentTypes?: string;
}

const ConfigScreen: React.FC = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const sdk = useSDK<ConfigAppSDK>();

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();
    return {
      parameters,
      targetState: currentState
    };
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(onConfigure);
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      };

      sdk.app.setReady();
    })();
  }, [sdk]);

  function updateParameters<T extends keyof AppInstallationParameters>(
    parameterName: T
  ) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setParameters({ ...parameters, [parameterName]: value });
    };
  };

  return (
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form>
        <Heading>App Config</Heading>
        <Paragraph>Welcome to your Contentful app. This is your config page.</Paragraph>
        <FormControl isRequired isInvalid={!parameters.targetContentTypes} key="targetContentTypes">
          <FormControl.Label>Target Content Types to Event Filter</FormControl.Label>
          <TextInput
            value={parameters.targetContentTypes}
            name="targetContentTypes"
            onChange={updateParameters('targetContentTypes')}
          />
        </FormControl>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
