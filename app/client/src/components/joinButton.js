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
import { PropTypes } from "prop-types"
import { joinCommunity } from "../redux/ducks/communityDuck"

const JoinButton = (props) => {
  const [flag, setFlag] = useState(false);


  const handleClick = () => {
    setFlag(!flag);
    props.joinCommunity(props.name)

  };

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      color={flag === true ? "error" : "success"}
      size="small"
    >
      {flag ? "Remove" : "Join"}
    </Button>
  );
};

JoinButton.propTypes = {
  joinCommunity: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({});

const mapActionsToProps = {
  joinCommunity
}

export default connect(mapStateToProps, mapActionsToProps)(JoinButton);
