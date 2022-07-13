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

/**
 * Application entry point
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import { Box, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmojiIcon from "@mui/icons-material/EmojiEmotions";

const AvatarIcon = (props) => {
  const type = props.type;
  const size = props.size;
  const shadow = props.shadow || false;

  const defaultColor = "#585858";
  const defaultImage = "../images/avatar/profile-icon-vector-150x150.jpg";

  switch (type) {
    case "Person":
      return (
        <Box
          sx={{
            height: `${size}px`,
            width: `${size}px`,
            m: 0,
            p: 0,
            backgroundColor: props.gradient
              ? "none"
              : props.colors?.primary || defaultColor,
            backgroundImage: props.gradient
              ? `linear-gradient(to bottom right, ${
                  props.colors?.primary || defaultColor
                }, ${props.colors?.secondary || defaultColor})`
              : "none",
            borderRadius: `${size}px`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: shadow ? `0 0 0 2px #FFF` : "none",
          }}
        >
          <PersonIcon sx={{ fontSize: size, color: "white", pb: size / 300 }} />
        </Box>
      );
    case "Emoji":
      return (
        <Box
          sx={{
            height: `${size}px`,
            width: `${size}px`,
            m: 0,
            p: 0,
            backgroundColor: props.gradient
              ? "none"
              : props.colors?.primary || defaultColor,
            backgroundImage: props.gradient
              ? `linear-gradient(to bottom right, ${
                  props.colors?.primary || defaultColor
                }, ${props.colors?.secondary || defaultColor})`
              : "none",
            borderRadius: `${size}px`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: shadow ? `0 0 0 2px #FFF` : "none",
          }}
        >
          <EmojiIcon
            sx={{ fontSize: size / 1.5, color: "white", pb: size / 300 }}
          />
        </Box>
      );
    case "Upload":
      return (
        <Avatar
          sx={{
            width: size,
            height: size,
            boxShadow: shadow ? `0 0 0 2px #FFF` : "none",
          }}
          src={props.image || defaultImage}
        />
      );
    default:
      return (
        <Box
          sx={{
            height: `${size}px`,
            width: `${size}px`,
            m: 0,
            p: 0,
            backgroundColor: props.gradient
              ? "none"
              : props.colors?.primary || defaultColor,
            backgroundImage: props.gradient
              ? `linear-gradient(to bottom right, ${
                  props.colors?.primary || defaultColor
                }, ${props.colors?.secondary || defaultColor})`
              : "none",
            borderRadius: `${size}px`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: shadow ? `0 0 0 2px #FFF` : "none",
          }}
        >
          <Typography
            sx={{
              fontSize: size / 2,
              color: "white",
            }}
          >
            {props.initials}
          </Typography>
        </Box>
      );
  }
};

export default AvatarIcon;
