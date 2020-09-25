const styles = theme => ({
  topBar: {
    height: 24,
    backgroundColor: theme.palette.primary.main,
  },
  infoText: {
    padding: theme.spacing(3),
    textAlign: 'start',
  },
  infoTitle: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: 0,
    textAlign: 'start',
    display: 'flex',
  },
  deleteLink: {
    fontSize: 14,
    color: '#3344dd',
    textDecoration: 'underline',
    marginLeft: theme.spacing(1),
  },
  list: {
    paddingLeft: theme.spacing(5),
  },
  districtItem: {
    paddingLeft: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  captionText: {
    color: '#000',
    fontWeight: 'normal',
  },
  loadingText: {
    paddingLeft: theme.spacing(6),
    paddingBottom: theme.spacing(1),
  },
  subtitle: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(6),
  },
  categoryItem: {
    paddingRight: 32,
    flexDirection: 'column',
  },
  categoryItemTitle: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  categoryItemContent: {
    paddingLeft: 32,
    marginRight: -32,
    width: '100%',
    boxSizing: 'border-box',
  },
  itemClickArea: {
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
  },
  right: {
    marginLeft: 'auto',
  },
  rightPadding: {
    paddingRight: theme.spacing(1),
  },
  addressArea: {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    textAlign: 'start',
  },
  addressTitle: {
    marginBottom: theme.spacing(2),
  },
  fieldFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
  },
  addressItem: {
    fontSize: 24,
  },
  divisionItem: {
    padding: theme.spacing(2),
  },
  areaTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    paddingTop: theme.spacing(2),
    height: 30,
  },
  sidePadding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  addressIcon: {
    fontSize: 24,
  },
  selectedAddress: {
    fontSize: 18,
  },
  subdistrictList: {
    paddingLeft: 32,
  },
  expandingElement: {
    boxShadow: 'none',
    width: '100%',
  },
  expandingElementContent: {
    marginBottom: -1,
  },
  testPadding: {
    paddingLeft: 0,
    paddingRight: theme.spacing(4),
  },
  accordionSummary: {
    minHeight: '48px !important',
    height: 48,
    padding: 0,
  },
  accordionSummaryContent: {
    margin: 0,
  },
  textExpanded: {
    margin: 0,
  },
  deleteButton: {
    marginLeft: theme.spacing(2),
  },
  unitListArea: {
    textAlign: 'left',
  },
  centerItems: {
    alignItems: 'center',
    padding: 0,
  },
  test: {
    backgroundColor: 'yellow',
  },
  accoridonContent: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  fullWidth: {
    width: '100%',
  },
});

export default styles;
