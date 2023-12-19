# Use a imagem oficial do Node.js 16.20 versão slim como base
FROM node:16.20-slim

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o yarn.lock para o diretório de trabalho
COPY package.json yarn.lock /app/

# Execute o comando yarn para instalar as dependências
RUN yarn

# Copie todos os arquivos do diretório atual para o diretório de trabalho
COPY . /app

# Exponha a porta 3091, caso a aplicação dentro do contêiner escute nessa porta
EXPOSE 3091

# Comando padrão para iniciar a aplicação quando o contêiner for executado
CMD ["yarn", "start"]
