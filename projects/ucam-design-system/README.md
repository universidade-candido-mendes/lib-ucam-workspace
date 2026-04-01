# UCAM Design System

O UCAM Design System é uma biblioteca de componentes Angular desenvolvida para padronizar a interface do usuário em projetos da UCAM. Esta biblioteca segue a metodologia Atomic Design para organização dos componentes.

## Instalação

Para instalar a biblioteca em seu projeto Angular, execute o seguinte comando:

```bash
npm install @universidade-candido-mendes/ucam-design-system
```

## Configuração

1. Importe os componentes necessários do módulo `@universidade-candido-mendes/ucam-design-system` no seu componente:

```typescript
import { Component } from '@angular/core';
import { 
  UcamInputComponent,
  UcamSelectComponent,
  UcamNavbarComponent,
  UcamSidemenuComponent,
  UcamProfileComponent
} from '@universidade-candido-mendes/ucam-design-system';

@Component({
  selector: 'app-example',
  imports: [
    UcamInputComponent,
    UcamSelectComponent,
    UcamNavbarComponent,
    UcamSidemenuComponent,
    UcamProfileComponent
  ],
  standalone: true
})
export class ExampleComponent { }
```

## Componentes Disponíveis

### Átomos (Atoms)

#### Formulários
- **UcamInput**: Campo de entrada de texto com validação e estilização personalizada
- **UcamSelect**: Componente de seleção com suporte a múltiplas opções

### Organismos (Organisms)

#### Navegação
- **UcamNavbar**: Barra de navegação responsiva
- **UcamSidemenu**: Menu lateral com suporte a submenus
- **UcamProfile**: Componente de perfil do usuário

## Serviços

- **UcamDesignSystemService**: Serviço principal para configuração e gerenciamento do design system

## Uso Básico

### Exemplo de Input

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UcamInputComponent } from '@universidade-candido-mendes/ucam-design-system';

@Component({
  selector: 'app-example',
  template: `
    <ucam-input
      label="Nome"
      placeholder="Digite seu nome"
      [formControl]="nome">
    </ucam-input>
  `,
  imports: [UcamInputComponent, ReactiveFormsModule],
  standalone: true
})
export class ExampleComponent {
  nomeControl = new FormControl('');
}
```

## Desenvolvimento Local

Para testar a biblioteca em ambiente local, execute os seguintes comandos:

Na pasta do workspace:
```sh
ng build ucam-design-system && cd dist/ucam-design-system && npm link && cd ../..
```

Na pasta do projeto de teste:
```sh
npm link @universidade-candido-mendes/ucam-design-system && ng s
```

## Publicação

Para publicar uma nova versão da biblioteca:

```sh
cd dist/ucam-design-system && npm publish --access public && cd ../..
```

## Links

- Repository: [https://github.com/universidade-candido-mendes/lib-ucam-workspace](https://github.com/universidade-candido-mendes/lib-ucam-workspace)
  - Para bugs sensíveis como vulnerabilidades de segurança, por favor contate
    cpd@ucam-campos.br diretamente ao invés de usar o issue tracker.

## Versionamento

Versão atual: 20.0.1

## Autores

- **Matheus Souza**: [@matheuscruzsouza - Github](https://github.com/matheuscruzsouza)

Please follow github and join us!
Thanks to visiting me and good coding!
