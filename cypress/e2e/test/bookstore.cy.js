import { faker } from '@faker-js/faker';
import { removeLogs } from '@helper/removeLogs';
const username = faker.internet.email();
const password = faker.internet.password() + '@@';

describe('✅BookStore | Grid | Create and Get Books from the Store (POST-GET)', () => {
    let isbn, userID, token, expires;

    before('create user', () => {
        cy.fixture('data/getCreateBooks').then((the) => {
            cy.api({
                method: 'POST',
                url: the.url.createUser,
                body: {
                    userName: username,
                    password: password,
                },
            }).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.username).to.be.equal(username);
                userID = response.body.userID;
            });
            
            cy.visit('https://demoqa.com/login');
            cy.get('#userName').type(username);
            cy.get('#password').type(password);
            cy.get('#login').click();
            cy.url().should('include', 'profile');
            cy.get('#userName-value').should('have.text', username);
            
            cy.api({
                method: 'GET',
                url: the.url.getBooks,
            }).then((response) => {
                expect(response.status).to.eq(200);
                isbn = response.body.books[1].isbn;
            });
        });
    });
    
    beforeEach('generate token, verify authentication and set cookies', () => {
        cy.fixture('data/getCreateBooks').then((the) => {
            cy.api({
                method: 'POST',
                url: the.url.generateToken,
                failOnStatusCode: false,
                body: {
                    userName: username,
                    password: password,
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.status).to.be.equal('Success');
                expect(response.body.result).to.be.equal('User authorized successfully.');
                token = response.body.token;
                expires = response.body.expires;
                cy.api({
                    method: 'POST',
                    url: the.url.authorized,
                    body: {
                        userName: username,
                        password: password,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.be.an('boolean').and.eq(true);
                    cy.setCookie('userID', userID);
                    cy.setCookie('userName', username);
                    cy.setCookie('token', token);
                    cy.setCookie('expires', expires);
                });
                
                cy.visit('https://demoqa.com/books');
                cy.get('[id="userName-value"]').invoke('text').should('eq', username);
            });
        });
    });
    
    it('6310 | TC1: Validate displaying a store book', () => {
        cy.fixture('data/getCreateBooks').then((the) => {
            cy.api({
                method: 'GET',
                url: the.url.getBook,
                qs: {
                    ISBN: isbn,
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.isbn).to.be.equal(isbn);
            });
            
            cy.visit(`https://demoqa.com/profile?book=${isbn}`);
            //cy.get(`a[href*="profile?book=${isbn}"]`).should('be.visible').should('have.text', isbn)
            cy.get('#ISBN-wrapper').within(() => {
                cy.get("[id='userName-value']").should('have.text', isbn);
            });
        });
    });
    
    it('6310 | TC2: Validate save book in collection', () => {
        cy.fixture('data/getCreateBooks').then((the) => {
            cy.api({
                method: 'POST',
                url: the.url.saveBook,
                auth: {
                    bearer: token,
                },
                body: {
                    userId: userID,
                    collectionOfIsbns: [
                        {
                            isbn: isbn,
                        },
                    ],
                },
            })
            .then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.books[0].isbn).to.be.equal(isbn);
            })
            .then(() => {
                cy.contains('Login').click({ force: true });
                cy.get('[id=submit]').click({ force: true });
                cy.get('a[href*="profile"').click();
                cy.get(`a[href*="profile?book=${isbn}"]`).should('be.visible');
            });
        });
    });
    
    it('6310 | TC3: Validate not being able to save a non-existent book in collection', () => {
        cy.fixture('data/getCreateBooks').then((the) => {
            cy.api({
                method: 'POST',
                url: the.url.saveBook,
                failOnStatusCode: false,
                body: {
                    userId: userID,
                    collectionOfIsbns: [
                        {
                            isbn: the.noExistBook,
                        },
                    ],
                },
            })
            .then((response) => {
                expect(response.status).to.eq(401);
                expect(response.body.message).to.be.equal('User not authorized!');
            })
            .then(() => {
                cy.contains('Login').click({ force: true });
                cy.get('[id=submit]').click({ force: true });
                cy.get('a[href*="profile"').click();
                cy.get(`a[href*="profile?book=${the.noExistBook}"]`).should('not.exist');
            });
        });
    });
    
    after('delete user', () => {
        cy.api({
            method: 'DELETE',
            url: `https://demoqa.com/Account/v1/User/${userID}`,
            auth: {
                bearer: token,
            },
            body: {
                userId: userID,
            },
        }).then((response) => {
            expect(response.status).to.eq(204);
        });
    });
});
    

removeLogs();
