import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { Cpf } from 'br-helpers';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  useToast,
} from '@chakra-ui/react';
import * as Yup from 'yup';

import { PessoaProps } from 'types/pessoa';

import api from 'services/api';

import NavBar from 'components/NavBar';
import Table from 'components/Table';
import Input from 'components/Inputs/Default';
import InputMask from 'components/Inputs/Mask';
import Select, { OpcoesProps } from 'components/Inputs/Select';

import getValidationErrors from 'utils/getValidationErrors';
import getParsedDate from 'utils/getParsedDate';

const Pessoas = () => {
  const formularioRef = useRef<FormHandles>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [pessoas, setPessoas] = useState<PessoaProps[]>([]);
  const [loading, setLoading] = useState(false);

  const generoOpcoes: OpcoesProps[] = useMemo(
    () => [
      { label: 'Masculino', value: 'MASCULINO' },
      { label: 'Feminino', value: 'FEMININO' },
      { label: 'Não binário', value: 'NAO_BINARIO' },
      { label: 'Não informar', value: 'NAO_INFORMAR' },
      { label: 'Outro', value: 'OUTROS' },
    ],
    [],
  );

  const handlePessoas = useCallback(async () => {
    const { data } = await api.get('/pessoa');

    setPessoas(data);
  }, []);

  const handleAdicionarPessoa = useCallback(
    async data => {
      setLoading(true);
      formularioRef.current?.setErrors({});

      if (data.dataNascimento) {
        data.dataNascimento = getParsedDate(data.dataNascimento);
      }

      try {
        const schema = Yup.object().shape({
          nome: Yup.string().required(),
          genero: Yup.string().required(),
          email: Yup.string().email().required(),
          dataNascimento: Yup.date().required(),
          naturalidade: Yup.string().required(),
          nacionalidade: Yup.string().required(),
          cpf: Yup.string().required(),
          endereco: Yup.object().shape({
            rua: Yup.string().required(),
            cep: Yup.string().required(),
            numero: Yup.number().required(),
            complemento: Yup.string().optional(),
            bairro: Yup.string().required(),
            pais: Yup.string().required(),
            estado: Yup.string().required(),
            cidade: Yup.string().required(),
          }),
        });

        await schema.validate(data, { abortEarly: false });

        data.cpf = data.cpf.replace(/\D/g, '');

        const isValidCpf = Cpf.isValid(data.cpf);

        if (!isValidCpf) {
          setLoading(false);
          return formularioRef.current?.setFieldError('cpf', 'CPF inválido');
        }

        await api.post('/pessoa', data);

        toast({
          status: 'success',
          title: 'Finalizado',
          description: 'Usuário criado com sucesso',
          position: 'top-right',
        });

        await handlePessoas();

        onClose();

        setLoading(false);
      } catch (error) {
        setLoading(false);

        const errors = getValidationErrors(error);

        if (errors) {
          formularioRef.current?.setErrors(errors);
        }
      }
    },
    [toast, onClose, handlePessoas],
  );

  useEffect(() => {
    handlePessoas();
  }, [handlePessoas]);

  return (
    <Box width="100%" display="flex" flexDirection="column">
      <NavBar />
      <Box
        width="90%"
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
        marginTop={16}
      >
        <Button marginBottom={8} onClick={onOpen}>
          Adicionar pessoa
        </Button>
        <Table buscarPessoas={handlePessoas} pessoas={pessoas} />
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar uma pessoa</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} width="100%">
            <Form onSubmit={handleAdicionarPessoa} ref={formularioRef}>
              <Flex width="100%" justifyContent="space-between">
                <Box width="45%">
                  <Input name="nome" label="Nome" />
                  <Select name="genero" label="Genero" options={generoOpcoes} />
                  <Input name="email" label="E-mail" />
                  <InputMask name="cpf" mask="999.999.999-99" label="CPF" />
                  <InputMask
                    name="dataNascimento"
                    mask="99/99/9999"
                    label="Data de nascimento"
                  />
                  <Input name="naturalidade" label="Naturalidade" />
                  <Input name="nacionalidade" label="Nacionalidade" />
                </Box>
                <Box width="45%">
                  <Input name="endereco.cep" label="CEP" />
                  <Input name="endereco.rua" label="Rua" />
                  <Input name="endereco.numero" label="Número" />
                  <Input name="endereco.complemento" label="Complemento" />
                  <Input name="endereco.bairro" label="Bairro" />
                  <Input name="endereco.cidade" label="Cidade" />
                  <Input name="endereco.estado" label="Estado" />
                  <Input name="endereco.pais" label="País" />
                </Box>
              </Flex>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => formularioRef.current?.submitForm()}
              isLoading={loading}
              loadingText="Criando"
            >
              Criar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Pessoas;