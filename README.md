# SOFTPLAN - PESSOAS

API desenvolvida seguindo o modelo de maturidade Richardson para o desafio softplan.
Contendo paginação, validação, versionamento de API, testes, /source e autenticação basic.

A principio utilizei MySQL durante o desenvolvimento, também para garantir a correnta modelagem do banco de dados.
Para deploy no docker, a API utiliza um H2 temporário para não deixar o container tão pesado.

Tecnologia front-end: NextJS    
Tecnologia back-end: Java Spring Boot 

| URL | NOME |
| ------ | ------ |
| localhost:8080/swagger | swagger |
| localhost:3000/ | front-end |
| localhost:8080/source | links dos repositórios |

## Como rodar - Front e API juntos
É preciso expor as portas da aplicação
Front-end: porta 3000   
API: porta 8080  
```
docker run -td -p 3000:3000 -p 8080:8080 pedrobipede/softplan-pessoas:latest
```

## Como rodar - Apenas API
É preciso expor as portas da aplicação  
API: porta 8080  
```
docker run -td -p 3000:3000 -p 8080:8080 pedrobipede/softplan-pessoas-api:latest
```

## Repositórios ##
dockerhub com front-end: https://hub.docker.com/repository/docker/pedrobipede/softplan-pessoas  
dockerhub sem front-end: https://hub.docker.com/repository/docker/pedrobipede/softplan-pessoas-api   
código frontend: https://github.com/dev-vasconcelos/softplan-pessoas-front  
código back-end: https://hub.docker.com/repository/docker/pedrobipede/softplan-pessoas-api


