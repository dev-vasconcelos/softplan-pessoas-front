import { EnderecoProps } from './endereco';

type GeneroType =
  | 'MASCULINO'
  | 'FEMININO'
  | 'NAO_BINARIO'
  | 'NAO_INFORMAR'
  | 'OUTROS';

export interface PessoaProps {
  id: 0;
  nome: string;
  genero: GeneroType;
  email: string;
  dataNascimento: Date;
  naturalidade: string;
  nacionalidade: string;
  cpf: string;
  endereco: EnderecoProps;
}
