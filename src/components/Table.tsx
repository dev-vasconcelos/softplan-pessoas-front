import { useCallback, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Cpf } from 'br-helpers';
import {
  Table as TableComponent,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  useColorModeValue,
  IconButton,
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
  Text,
  ListItem,
  List,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import * as Yup from 'yup';

import { PessoaProps } from 'types/pessoa';

import Input from 'components/Inputs/Default';
import InputMask from 'components/Inputs/Mask';
import Select, { OpcoesProps } from 'components/Inputs/Select';

import api from 'services/api';

import getParsedDate from 'utils/getParsedDate';
import getValidationErrors from 'utils/getValidationErrors';
import getFormatedCpf from 'utils/getFormatedCpf';

interface Props {
  pessoas: PessoaProps[];
  buscarPessoas(): Promise<void>;
}

const Table = ({ pessoas, buscarPessoas }: Props) => {
  const formularioRef = useRef<FormHandles>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<'show' | 'update' | 'delete'>(
    'show',
  );
  const [pessoaSelecionada, selecionarPessoa] = useState<PessoaProps>(
    {} as PessoaProps,
  );

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

  const modalNomes = useMemo(
    () => ({
      show: 'Visualizar informações de',
      update: 'Atualizar informações de',
      delete: 'Deletar informações de',
    }),
    [],
  );

  const handleAtualizarPessoa = useCallback(
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

        await api.put(`/pessoa/${pessoaSelecionada.id}`, data);

        await buscarPessoas();

        toast({
          status: 'success',
          title: 'Finalizado',
          description: 'Pessoa atualizada com sucesso',
          position: 'top-right',
        });

        onClose();

        return setLoading(false);
      } catch (error) {
        setLoading(false);

        const errors = getValidationErrors(error);

        if (errors) {
          formularioRef.current?.setErrors(errors);
        }
      }
    },
    [toast, onClose, buscarPessoas, pessoaSelecionada],
  );

  const handleRemovePessoa = useCallback(async () => {
    setLoading(true);

    try {
      await api.delete(`/pessoa/${pessoaSelecionada.id}`);

      await buscarPessoas();

      toast({
        status: 'success',
        title: 'Finalizado',
        description: 'Pessoa apagada com sucesso',
        position: 'top-right',
      });

      onClose();

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [toast, pessoaSelecionada, buscarPessoas, onClose]);

  return (
    <>
      <TableComponent
        variant="striped"
        colorScheme="purple"
        alignSelf="center"
        borderRadius="12px"
        borderColor={useColorModeValue('gray.50', 'gray.800')}
        borderWidth="3px"
      >
        <TableCaption>Lista de pessoas cadastradas</TableCaption>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>CPF</Th>
            <Th textAlign="right">Opções</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pessoas.map(pessoa => (
            <Tr>
              <Td>{pessoa.nome}</Td>
              <Td>{getFormatedCpf(pessoa.cpf)}</Td>
              <Td textAlign="right">
                <IconButton
                  icon={<ViewIcon />}
                  aria-label="edit-button"
                  colorScheme="green"
                  onClick={() => {
                    setModalType('show');
                    selecionarPessoa(pessoa);
                    onOpen();
                  }}
                />
                <IconButton
                  icon={<EditIcon />}
                  aria-label="edit-button"
                  colorScheme="orange"
                  marginLeft={1}
                  onClick={() => {
                    setModalType('update');
                    selecionarPessoa(pessoa);
                    onOpen();
                  }}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="edit-button"
                  colorScheme="red"
                  marginLeft={1}
                  onClick={() => {
                    setModalType('delete');
                    selecionarPessoa(pessoa);
                    onOpen();
                  }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableComponent>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        size="2xl"
      >
        <ModalOverlay />
        {isOpen && modalType === 'show' && pessoaSelecionada && (
          <ModalContent>
            <ModalHeader>
              {modalNomes[modalType]} {pessoaSelecionada.nome}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} width="100%">
              <Flex justifyContent="space-between">
                <Box>
                  <List spacing={2}>
                    <Text fontWeight="bold" fontSize="2xl">
                      Informações pessoais
                    </Text>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Nome:
                      </Text>{' '}
                      {pessoaSelecionada.nome}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        E-mail:
                      </Text>{' '}
                      {pessoaSelecionada.email}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Data de nascimento:
                      </Text>{' '}
                      {dayjs(pessoaSelecionada.dataNascimento).format(
                        'DD/MM/YYYY',
                      )}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        CPF:
                      </Text>{' '}
                      {getFormatedCpf(pessoaSelecionada.cpf)}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Nacionalidade:
                      </Text>{' '}
                      {pessoaSelecionada.nacionalidade}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Naturalidade:
                      </Text>{' '}
                      {pessoaSelecionada.naturalidade}
                    </ListItem>
                    <ListItem textTransform="capitalize">
                      <Text as="span" fontWeight="bold">
                        Gênero:
                      </Text>{' '}
                      {pessoaSelecionada.genero.toLowerCase()}
                    </ListItem>
                  </List>
                </Box>
                <Box>
                  <List spacing={2}>
                    <Text fontWeight="bold" fontSize="2xl">
                      Informações de endereço
                    </Text>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        CEP:
                      </Text>{' '}
                      {pessoaSelecionada.endereco.cep}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Rua:
                      </Text>{' '}
                      {pessoaSelecionada.endereco.rua}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Número:
                      </Text>{' '}
                      {pessoaSelecionada.endereco.numero}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Bairro:
                      </Text>{' '}
                      {pessoaSelecionada.endereco.bairro}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Complemento:
                      </Text>{' '}
                      {pessoaSelecionada.endereco.complemento}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Cidade:
                      </Text>{' '}
                      {pessoaSelecionada.endereco.cidade}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        Estado:
                      </Text>{' '}
                      {pessoaSelecionada.endereco.estado}
                    </ListItem>
                    <ListItem>
                      <Text as="span" fontWeight="bold">
                        País:
                      </Text>{' '}
                      {pessoaSelecionada.endereco.pais}
                    </ListItem>
                  </List>
                </Box>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>Fechar</Button>
            </ModalFooter>
          </ModalContent>
        )}
        {modalType === 'update' && (
          <ModalContent>
            <ModalHeader>
              {modalNomes[modalType]} {pessoaSelecionada.nome}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} width="100%">
              <Form
                onSubmit={handleAtualizarPessoa}
                ref={formularioRef}
                initialData={{
                  ...pessoaSelecionada,
                  dataNascimento: dayjs(
                    pessoaSelecionada.dataNascimento,
                  ).format('DD/MM/YYYY'),
                }}
              >
                <Flex width="100%" justifyContent="space-between">
                  <Box width="45%">
                    <Input name="nome" label="Nome" />
                    <Select
                      name="genero"
                      label="Genero"
                      options={generoOpcoes}
                    />
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
                loadingText="Carregando"
              >
                Confirmar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        )}
        {modalType === 'delete' && (
          <ModalContent>
            <ModalHeader>
              {modalNomes[modalType]} {pessoaSelecionada.nome}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} width="100%">
              <Text
                fontSize="large"
                fontWeight="medium"
                color="red.300"
                width="80%"
              >
                Você tem certeza que deseja apagar as informações deste usuário?
                Essa ação não poderá ser desfeita.
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => handleRemovePessoa()}
                isLoading={loading}
                loadingText="Carregando"
              >
                Confirmar
              </Button>
              <Button colorScheme="green" onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

export default Table;
