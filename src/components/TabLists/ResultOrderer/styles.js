

export default theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    flex: '1 0 auto',
    flexWrap: 'nowrap',
    textAlign: 'left',
  },
  selectEmpty: {
    marginTop: theme.spacing.unitDouble,
  },
});
