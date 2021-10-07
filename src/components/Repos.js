import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) return total;
    if (!total[language]) {
      total[language] = { label: language, value: 1, starts: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        starts: total[language].starts + stargazers_count,
      };
    }
    return total;
  }, {});
  const mostUsed = Object.values(languages)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const mostPopular = Object.values(languages)
    .sort((a, b) => b.starts - a.starts)
    .map((item) => {
      return { ...item, value: item.starts };
    })
    .slice(0, 5);
  //start forks
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[stargazers_count] = {
        label: name,
        value: stargazers_count,
      };
      total.forks[forks] = { lable: name, value: forks };
      return total;
    },
    { stars: {}, forks: {} }
  );
  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();
  const chartData = [
    {
      label: 'html',
      value: '100',
    },
    {
      label: 'css',
      value: '40',
    },
    {
      label: 'JavaScript',
      value: '200',
    },
    {
      label: 'Java',
      value: '250',
    },
  ];
  return (
    <section className='section'>
      <Wrapper className='section-center'>
        <Pie3D chartData={mostUsed} />
        <Doughnut2D chartData={mostPopular} />
        <Column3D chartData={stars} />
        <Bar3D chartData={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
