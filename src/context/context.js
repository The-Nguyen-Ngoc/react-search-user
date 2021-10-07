import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

//provider

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowes] = useState(mockFollowers);

  //requests loading
  const [requests, setRequests] = useState(0);
  const [loading, setIsLoading] = useState(false);
  //error
  const [error, setError] = useState({ show: false, msg: '' });

  const searchGithubUser = async (user) => {
    //toggleError
    setIsLoading(true);
    toggleError();
    const response = await axios
      .get(`${rootUrl}/users/${user}`)
      .catch((err) => {
        console.log(err);
      });
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      //repos
      axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
        setRepos(response.data)
      );
      //followers
      axios(`${followers_url}?per_page=100`).then((response) =>
        setFollowes(response.data)
      );
    } else {
      toggleError(true, 'Không tìm thấy người dùng!');
    }
    checkRequests();
    setIsLoading(false);
  };
  //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let { remaining } = data.rate;

        console.log(remaining);
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(
            true,
            'Xin lỗi, bạn đã dùng hết số lần gửi yêu cầu, vui lòng quay lại sau'
          );
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleError(show = false, msg = '') {
    setError({ show, msg });
  }
  useEffect(checkRequests, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
