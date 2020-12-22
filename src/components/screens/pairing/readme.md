## @types/huelite

- modified the structure to ducks architecture
- added `ts` field to types=> `USER_Device_t`, `USER_DEVICE_t`, `HUE_CONTAINER_t`, `HUE_Container_t`, `HUE_DEVICE_t`, `HUE_Device_t`, `HUE_TIMER_t`, `HUE_Timer_t`

#### @featureRequest

- `PAIRING_SCREEN_1`
  - [x] compaitablity with new@types/huelite
  - [x] new API class implementation
- `PAIRING_SCREEN_2`
  - [x] compaitablity with new@types/huelite
  - [x] new API class implementation
  - [ ] improve vibration on selectedEiFI change <!-- temperory commented out -->
  - [ ] //IMP skip pairing
  - [ ] //IMP check if device is available
- `PAIRING_SCREEN_3`
  - [ ] compaitablity with new@types/huelite
  - [ ] new API class implementation
  - [x] //IMP go back to change selected wifi
  - [ ] select from existing groups horizontal scrollbar
  - [x] suggested group names horizontal scrollbar
- [x] navigator

## CHANGELOG

###### components/screens/pairing

- **REMOVED** unused files and varients from SCREEN/PAIRING/\*\*
- moved all onPress functionality to onInteractivity
- removed unused code from pairingScreen3/index
