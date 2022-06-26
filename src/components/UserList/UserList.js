import React, { useEffect, useState, useRef } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";

const UserList = ({ users, isLoading, tab, loadMore }) => {
  const elementRef = useRef();
  const [hoveredUserId, setHoveredUserId] = useState();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [favoriteUsers, setFavoriteUsers] = useState(() => {
    const savedUsers = localStorage.getItem("favoriteUsers");
    const initialValue = JSON.parse(savedUsers);
    return initialValue || {};
  });

  
  useEffect(() => {
    const divElement = elementRef.current;
    divElement.addEventListener('scroll', handleScroll, true);
  }, []);

  const handleScroll = event => {
    const scrollRatio = (event.target.scrollHeight / event.target.scrollTop) - 1;
    if (scrollRatio < 0.5) {
      loadMore && loadMore();
    }
  };

  useEffect(() => {
    filterUsers();
  }, [users]);

  useEffect(() => {
    filterUsers()
  }, [selectedCountries]);

  useEffect(() => {
    if (tab === 'home') {
      filterUsers();
    } else {
      filterFavorites(filteredUsers);
    }
  }, [tab]);

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };

  const filterChange = (countryCode) => {
    let change = JSON.parse(JSON.stringify(selectedCountries));
    if (selectedCountries.find(code => code === countryCode)) {
      const index = selectedCountries.indexOf(countryCode);
      change.splice(index, 1);
      setSelectedCountries(change);
    } else {
      change.push(countryCode);
      setSelectedCountries(change);
    }
  }

  const filterUsers = () => {
    let mutatedUsers;
    if (selectedCountries.length === 0) {
      mutatedUsers = users;
    } else {
      mutatedUsers = users.filter(user => selectedCountries.some(code => user.nat === code));
    }
    if (tab === 'favorites') {
      filterFavorites(mutatedUsers);
      return;
    }
    setFilteredUsers(mutatedUsers);
  }

  const filterFavorites = (mutatedUsers) => {
    setFilteredUsers(mutatedUsers.filter(user => !!favoriteUsers[user.login.username]));
  }

  const toggleLike = (user) => {
    if (favoriteUsers[user.login.username]) {
      delete favoriteUsers[user.login.username];
    } else {
      favoriteUsers[user.login.username] = [user.login.username];
    }
    setFavoriteUsers(favoriteUsers);
    localStorage.setItem("favoriteUsers",  JSON.stringify(favoriteUsers));
    filterUsers();
  }

  return (
    <S.UserList>
      <S.Filters>
        <CheckBox value="BR" label="Brazil" onChange={filterChange}/>
        <CheckBox value="AU" label="Australia" onChange={filterChange}/>
        <CheckBox value="CA" label="Canada" onChange={filterChange}/>
        <CheckBox value="DE" label="Germany" onChange={filterChange}/>
      </S.Filters>
      <S.List ref={elementRef}>
        {filteredUsers.map((user, index) => {
          return (
            <S.User
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <S.UserPicture src={user?.picture.large} alt="" />
              <S.UserInfo>
                <Text size="22px" bold>
                  {user?.name.title} {user?.name.first} {user?.name.last}
                </Text>
                <Text size="14px">{user?.email}</Text>
                <Text size="14px">
                  {user?.location.street.number} {user?.location.street.name}
                </Text>
                <Text size="14px">
                  {user?.location.city} {user?.location.country}
                </Text>
              </S.UserInfo>
              <S.IconButtonWrapper isVisible={index === hoveredUserId || favoriteUsers[user.login.username]}>
                <IconButton onClick={() => toggleLike(user)}>
                  <FavoriteIcon color="error" />
                </IconButton>
              </S.IconButtonWrapper>
            </S.User>
          );
        })}
        {isLoading && (
          <S.SpinnerWrapper>
            <Spinner color="primary" size="45px" thickness={6} variant="indeterminate" />
          </S.SpinnerWrapper>
        )}
      </S.List>
    </S.UserList>
  );
};

export default UserList;
