# Instruções para Adicionar Imagens

Este documento contém instruções para adicionar as imagens necessárias para o funcionamento correto dos jogos do site Mundo das Garotas.

## 1. Jogo de Vestir (Estilista Gamer)

### Estrutura de Pastas
```
img/vestir/
    base.png (personagem base)
    cabelo-1.png
    cabelo-2.png
    cabelo-3.png
    cabelo-4.png
    cabelo-5.png
    blusa-1.png
    blusa-2.png
    blusa-3.png
    blusa-4.png
    blusa-5.png
    calca-1.png
    calca-2.png
    calca-3.png
    calca-4.png
    calca-5.png
    calca-6.png
    calca-7.png
    sapato-1.png
    sapato-2.png
    sapato-3.png
    sapato-4.png
    sapato-5.png
    sapato-6.png
    sapato-7.png
    acessorio-1.png
    acessorio-2.png
    acessorio-3.png
    acessorio-4.png
    acessorio-5.png
```

### Requisitos
- A imagem `base.png` deve ser a personagem sem roupas (com roupa íntima básica)
- Todas as imagens devem ter fundo transparente (PNG)
- Todas as imagens devem ter o mesmo tamanho e proporção
- Recomendado: 600x800 pixels

## 2. Jogo de Colorir (Mundo Colorido)

### Estrutura de Pastas
```
img/colorir/
    desenho-1.svg
    desenho-2.svg
    desenho-3.svg
    desenho-4.svg
    desenho-5.svg
    desenho-6.svg
```

### Requisitos
- Os arquivos SVG devem ter elementos separados para permitir colorir partes diferentes
- Cada elemento deve ter um atributo `fill` com valor inicial "white"
- Recomendado: SVGs com tamanho de 600x600 pixels

## 3. Jogo da Memória (Super Memória)

### Estrutura de Pastas
```
img/memoria/
    carta-1.png
    carta-2.png
    carta-3.png
    carta-4.png
    carta-5.png
    carta-6.png
    carta-7.png
    carta-8.png
    carta-9.png
    carta-10.png
    carta-11.png
    carta-12.png
    carta-verso.png
```

### Requisitos
- As imagens das cartas devem ser quadradas
- A imagem `carta-verso.png` será usada para o verso de todas as cartas
- Recomendado: 200x200 pixels

## 4. Jogo de Cuidar do Pet (Meu Pet Gamer)

### Estrutura de Pastas
```
img/pet/
    base.png (pet acordado)
    dormindo.png (pet dormindo)
    comendo.png (pet comendo)
    brincando.png (pet brincando)
    chapeu-1.png
    chapeu-2.png
    chapeu-3.png
    roupa-1.png
    roupa-2.png
    roupa-3.png
    coleira-1.png
    coleira-2.png
    coleira-3.png
```

### Requisitos
- A imagem `base.png` deve ser o pet sem acessórios
- A imagem `dormindo.png` deve ser o pet em estado de sono
- A imagem `comendo.png` deve ser o pet comendo
- A imagem `brincando.png` deve ser o pet brincando
- Todas as imagens devem ter fundo transparente (PNG)
- Todas as imagens devem ter o mesmo tamanho e proporção
- Recomendado: 400x400 pixels

## Notas Adicionais

- Todas as imagens devem ter fundo transparente (formato PNG)
- Mantenha um tamanho consistente para as imagens de cada jogo
- Para os SVGs do jogo de colorir, certifique-se de que os elementos estão separados para permitir colorir partes diferentes
- Resolução recomendada: pelo menos 300x300 pixels para garantir boa qualidade 