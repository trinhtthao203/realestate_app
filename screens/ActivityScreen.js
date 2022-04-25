import React from "react";
import { Spinner, HStack, Center, NativeBaseProvider } from "native-base";

const Example = () => {
  return (
    <HStack space={3}>
      <Spinner size="lg" />
    </HStack>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Example />
      </Center>
    </NativeBaseProvider>
  );
};
