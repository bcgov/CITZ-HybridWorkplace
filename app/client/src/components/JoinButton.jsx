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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { joinCommunity, leaveCommunity } from "../redux/ducks/communityDuck";

import { IconButton, Typography, Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const JoinButton = (props) => {
  const { community } = props;
  useEffect(() => {
    setIsInCommunity(community.userIsInCommunity);
    return () => {};
  }, [community]);

  const [isInCommunity, setIsInCommunity] = useState(
    community.userIsInCommunity
  );

  const handleJoin = async () => {
    const successful = await props.joinCommunity(community.title);
    setIsInCommunity(successful);
  };

  const handleLeave = async () => {
    const successful = await props.leaveCommunity(community.title);
    if (successful) {
      setIsInCommunity(false);
    }
  };

  return (
    <>
      {isInCommunity && (
        <IconButton
          variant="contained"
          disableRipple
          color={"error"}
          onClick={handleLeave}
        >
          <LogoutOutlinedIcon />
        </IconButton>
      )}
      {!isInCommunity && (
        <Button
          onClick={handleJoin}
          variant="contained"
          size="small"
          disabled={isInCommunity}
          sx={{ backgroundColor: "success.main" }}
        >
          <Typography sx={{ fontSize: "12px", textTransform: "none" }}>
            <b>Join</b>
          </Typography>
        </Button>
      )}
    </>
  );
};

JoinButton.propTypes = {
  joinCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  joinCommunity,
  leaveCommunity,
};

export default connect(mapStateToProps, mapActionsToProps)(JoinButton);
