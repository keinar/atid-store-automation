import { faker } from '@faker-js/faker';

export const generateGuestDetails = () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    company: faker.company.name(),
    country: 'Israel',
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    postcode: faker.location.zipCode(),
    email: faker.internet.email(),
    phone: '050' + faker.string.numeric(7), 
});