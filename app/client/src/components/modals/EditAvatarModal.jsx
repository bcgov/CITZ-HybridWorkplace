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

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import AvatarIcon from "../AvatarIcon";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Stack,
  DialogActions,
  Radio,
  Box,
  TextField,
  Checkbox,
} from "@mui/material";

import { closeEditAvatarModal } from "../../redux/ducks/modalDuck";
import { editUserAvatar } from "../../redux/ducks/profileDuck";

const EditAvatarModal = (props) => {
  const [avatar, setAvatar] = useState(props.profile.avatar);
  useEffect(() => {
    setAvatar(props.profile.avatar);
  }, [props.profile, props.profile.avatar]);

  const [image, setImage] = useState(avatar?.image || null);
  const initials = props.profile.initials || "";
  const [useGradient, setUseGradient] = useState(avatar?.gradient || false);

  const types = ["Initials", "Person", "Emoji", "Upload"];
  const [selectedType, setSelectedType] = useState(
    avatar?.avatarType || "Initials"
  );

  const colors = {
    magenta: "#cb42f5",
    purple: "#690787",
    blue: "#0a3194",
    lightBlue: "#198ae6",
    green: "#059c00",
    lightGreen: "#2cd40b",
    yellow: "#f0ec05",
    orange: "#f0890c",
    red: "#e33010",
    pink: "#f0887a",
  };

  const [selectedColors, setSelectedColors] = useState(
    avatar?.colors || {
      primary: colors.magenta,
      secondary: colors.magenta,
    }
  );

  const updateAvatar = async (event) => {
    event.preventDefault();
    const userChanges = {
      avatar: {
        avatarType: selectedType,
        image: image,
        gradient: useGradient,
        colors: selectedColors,
      },
    };

    const successful = await props.editUserAvatar(userChanges);
    if (successful === true) {
      props.closeEditAvatarModal();
    }
  };

  const handleColorChange = (event) => {
    setSelectedColors({
      primary: event.target.value,
      secondary: selectedColors.secondary,
    });
  };

  const handleSecondaryColorChange = (event) => {
    setSelectedColors({
      primary: selectedColors.primary,
      secondary: event.target.value,
    });
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.value);
  };

  const handleGradientToggle = (event) => {
    setUseGradient(event.target.checked);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeEditAvatarModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Edit Avatar
        </Typography>
      </DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1}>
          <AvatarIcon
            type={selectedType}
            initials={initials}
            image={image}
            gradient={useGradient}
            colors={selectedColors}
            size={150}
          />

          <Stack spacing={1} sx={{ overflow: "hidden" }}>
            {selectedType === "Upload" ? (
              <TextField
                onChange={handleImageChange}
                placeholder="Image URL"
                value={image}
                sx={{ width: 0.9 }}
              />
            ) : (
              <>
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center" }}
                >
                  <Typography>Use Gradient:</Typography>
                  <Checkbox
                    checked={useGradient}
                    onChange={handleGradientToggle}
                    sx={{ width: "10px" }}
                  />
                </Stack>
                <Stack direction="row">
                  {Object.keys(colors).map((color) => (
                    <Radio
                      key={color}
                      checked={selectedColors.primary === colors[color]}
                      onChange={handleColorChange}
                      value={colors[color]}
                      sx={{ height: "45px", width: "45px" }}
                      icon={
                        <Box
                          sx={{
                            height: "25px",
                            width: "25px",
                            backgroundColor: colors[color],
                            borderRadius: "25px",
                          }}
                        />
                      }
                      checkedIcon={
                        <Box
                          sx={{
                            height: "25px",
                            width: "25px",
                            backgroundColor: colors[color],
                            border: "solid",
                            borderRadius: "25px",
                          }}
                        />
                      }
                    />
                  ))}
                </Stack>
                {useGradient && (
                  <Stack direction="row">
                    {Object.keys(colors).map((color) => (
                      <Radio
                        key={color}
                        checked={selectedColors.secondary === colors[color]}
                        onChange={handleSecondaryColorChange}
                        value={colors[color]}
                        sx={{ height: "45px", width: "45px" }}
                        icon={
                          <Box
                            sx={{
                              height: "25px",
                              width: "25px",
                              backgroundColor: colors[color],
                              borderRadius: "25px",
                            }}
                          />
                        }
                        checkedIcon={
                          <Box
                            sx={{
                              height: "25px",
                              width: "25px",
                              backgroundColor: colors[color],
                              border: "solid",
                              borderRadius: "25px",
                            }}
                          />
                        }
                      />
                    ))}
                  </Stack>
                )}
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            {types.map((type) => (
              <Radio
                key={type}
                checked={selectedType === type}
                onChange={handleTypeChange}
                value={type}
                icon={<Typography>{type}</Typography>}
                checkedIcon={<Typography>{type}</Typography>}
              />
            ))}
          </Stack>

          <DialogActions
            sx={{
              m: 0,
              pb: 0,
            }}
          >
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button variant="contained" onClick={updateAvatar}>
                Save
              </Button>
              <Button variant="contained" onClick={props.closeEditAvatarModal}>
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  open: state.modal.editAvatar.open,
  avatar: state.modal.editAvatar.avatar,
  profile: state.profile.user,
});

export default connect(mapStateToProps, {
  closeEditAvatarModal,
  editUserAvatar,
})(EditAvatarModal);
