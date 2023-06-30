import slugify from 'slugify';

export const getPageRoutePath = ({ name }) => {
  return `${slugify(name, { lower: true })}`;
};
