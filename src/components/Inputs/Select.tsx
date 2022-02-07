import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import {
  FormLabel,
  SelectProps,
  Select as SelectComponent,
  Text,
} from '@chakra-ui/react';

export interface OpcoesProps {
  value: string | number;
  label: string;
}

interface Props extends SelectProps {
  name: string;
  label?: string;
  options: OpcoesProps[];
}

const Select = ({ name, label, options, ...rest }: Props) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: ref => {
        return ref.value;
      },
      setValue: (ref, v) => {
        ref.value = v;
      },
      clearValue: ref => {
        ref.value = '';
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

      <SelectComponent
        name={fieldName}
        ref={inputRef}
        placeholder="Selecione uma opção"
        defaultValue={defaultValue}
        {...rest}
      >
        {options.length > 0 &&
          options.map(option => (
            <option value={option.value}>{option.label}</option>
          ))}
      </SelectComponent>

      {error && (
        <Text color="red.300" fontSize="smaller" marginTop={1}>
          {error}
        </Text>
      )}
    </>
  );
};

export default Select;
