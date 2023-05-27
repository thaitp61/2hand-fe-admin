import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const wallet = [...Array(24)].map((_, index) => ({
    id: faker.datatype.uuid(),
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
    name: faker.name.fullName(),
    // company: faker.company.name(),
    email: faker.internet.email(),
    isVerified: faker.datatype.boolean(),
    wallet: faker.datatype.number({ max: 1000 }),
    status: sample(['active', 'banned']),
    // role: sample([
    //   'Leader',
    //   'Hr Manager',
    //   'UI Designer',
    //   'UX Designer',
    //   'UI/UX Designer',
    //   'Project Manager',
    //   'Backend Developer',
    //   'Full Stack Designer',
    //   'Front End Developer',
    //   'Full Stack Developer',
    // ]),
    createAt: faker.date.between('2023-05-01', '2023-05-31').toString(),
}));

export default wallet;
