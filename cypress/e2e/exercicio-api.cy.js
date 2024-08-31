/// <reference types= "cypress"/>
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  let num = Math.floor(Math.random() * 100000000)
  let usuario = 'Fulano ' + num
  let email = 'fulano' + num + '@ebac.com' 
  let emailFalho = 'fulano' + num + 'ebac.com' 


  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
    
  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
        expect(response.status).equal(200)
        expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {   
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body:
      {
        "nome": usuario,
        "email": email,
        "password": "teste",
        "administrador": "true"
      }
    }).should((response) => {
        expect(response.status).equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body:
      {
        "nome": usuario,
        "email": emailFalho,
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
    }).should((response) => {
        expect(response.status).equal(400)
        expect(response.body.email).equal('email deve ser um email válido')
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request('usuarios').then(response => {
      let id = response.body.usuarios[0]._id
      cy.request({
          method: 'PUT', 
          url: `usuarios/${id}`,
          body: 
          {
            "nome": usuario,
            "email": email + '.br',
            "password": "teste",
            "administrador": "true"
            }
      }).should((response) => {
          expect(response.status).equal(200)
          expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
  })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario("Fulano do Bairro","fulanobairro@ebac.com.br","teste","true")
      .then(response => {
      let id = response.body._id
      cy.request({
          method: 'DELETE', 
          url: `usuarios/${id}`
      }).should((response) => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).equal(200)

      })
  })
  });


});
