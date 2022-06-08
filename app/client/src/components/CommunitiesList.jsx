/* 
 Copyright © 2022 Province of British Columbia

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Application entry point
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DeleteCommunityModal from "./modals/DeleteCommunityModal";
import Community from "./Community";

import { getCommunities } from "../redux/ducks/communityDuck";

const CommunitiesList = (props) => {
  useEffect(() => {
    props.getCommunities();
  }, []);

  return (
    <div>
      {props.communities.items.map((community) => (
        <Community community={community} />
      ))}
      <DeleteCommunityModal />
    </div>
  );
};

CommunitiesList.propTypes = {
  getCommunities: PropTypes.func.isRequired,
  communities: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities,
});

export default connect(mapStateToProps, { getCommunities })(CommunitiesList);
