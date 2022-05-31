//
// Copyright © 2022 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { joinCommunity, leaveCommunity } from "../redux/ducks/communityDuck";

const JoinButton = (props) => {
  const { community, communities } = props;
  const [isInCommunity, setIsInCommunity] = useState(
    communities.usersCommunities.includes(community.title)
  );

  const handleJoin = async () => {
    setIsInCommunity(true);
    const successful = await props.joinCommunity(community.title);
    if (successful === false) {
      setIsInCommunity(false);
    }
  };

  const handleLeave = async () => {
    setIsInCommunity(false);
    const successful = await props.leaveCommunity(community.title);
    if (successful === false) {
      setIsInCommunity(true);
    }
  };

  return (
    <>
      {isInCommunity && (
        <Button variant="contained" color={"error"} onClick={handleLeave}>
          Leave Community
        </Button>
      )}
      <Button
        onClick={handleJoin}
        variant="contained"
        color={"success"}
        size="small"
        disabled={isInCommunity}
      >
        {isInCommunity ? "Remove" : "Join"}
      </Button>
    </>
  );
};

JoinButton.propTypes = {
  joinCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities,
});

const mapActionsToProps = {
  joinCommunity,
  leaveCommunity,
};

export default connect(mapStateToProps, mapActionsToProps)(JoinButton);
