import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import InputMaskComponent from 'react-input-mask';

import {
  FormLabel,
  Input as InputComponent,
  InputProps,
  Text,
} from '@chakra-ui/react';

interface Props extends InputProps {
  name: string;
  label?: string;
  mask: string;
}

const InputMask = ({ name, label, mask, ...rest }: Props) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: ref => {
        ref.current.value = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <>
      {label && (
        <FormLabel marginTop={2} htmlFor={fieldName} id={fieldName}>
          {label}
        </FormLabel>
      )}

      <InputComponent
        ref={inputRef}
        id={fieldName}
        defaultValue={defaultValue}
        as={InputMaskComponent}
        mask={mask}
        maskChar={null}
        {...rest}
      />

      {error && (
        <Text color="red.300" fontSize="smaller" marginTop={1}>
          {error}
        </Text>
      )}
    </>
  );
};

export default InputMask;
