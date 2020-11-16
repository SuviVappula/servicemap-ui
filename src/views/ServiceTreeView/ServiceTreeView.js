import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  List, ListItem, Collapse, Checkbox, Typography, ButtonBase, NoSsr, Divider,
} from '@material-ui/core';
import {
  ArrowDropUp, ArrowDropDown, Search, Cancel,
} from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import config from '../../../config';
import SMButton from '../../components/ServiceMapButton';


const nodeFetchReducer = (state, action) => {
  // Handle local fetch state
  switch (action.type) {
    case 'start':
      return {
        ...state,
        fetching: [...state.fetching, action.fetching],
      };
    case 'end':
      return {
        ...state,
        fetching: state.fetching.filter(item => item !== action.fetching),
      };
    case 'complete':
      return {
        ...state,
        data: [...state.data, ...action.data],
        fetching: state.fetching.filter(item => item !== action.fetching),
      };
    default:
      throw new Error('Child node fetch failed');
  }
};

const ServiceTreeView = (props) => {
  const {
    classes,
    navigator,
    intl,
    serviceTree,
    settings,
    getLocaleText,
    fetchServiceTreeUnits,
    setTreeSerivces,
    setTreeSelected,
    setTreeOpened,
    setFetchedNode,
  } = props;

  const { // Service tree state from redux
    services, selected, opened, fetched,
  } = serviceTree.serviceTree;

  const { isFetching } = serviceTree.serviceTreeUnits;

  // State
  const [selectedOpen, setSelectedOpen] = useState(false);
  const [nodeData, dispatchNodeFetch] = useReducer(nodeFetchReducer, { data: [], fetching: [] });


  let citySettings = [];
  config.cities.forEach((city) => {
    citySettings.push(...settings.cities[city] ? [city] : []);
  });

  if (citySettings.length === config.cities.length) {
    citySettings = [];
  }

  const checkChildNodes = (node, nodes = []) => {
    // Find all visible child nodes, so they can be selected when the parent checkbox is selected
    if (services.find(e => e.id === node.children[0])) {
      const nodeObjects = node.children.map(child => services.find(e => e.id === child));
      nodes.push(...nodeObjects);
      // Check if any child nodes are opened to repeat this function on them
      nodeObjects.forEach((i) => {
        if (opened.some(e => e === i.id)) {
          nodes.push(...checkChildNodes(i));
        }
      });
      return nodes;
    }
    return [];
  };

  const fetchRootNodes = () => (
    // Fetch all top level 0 nodes (root nodes)
    fetch(`${config.serviceMapAPI.root}/service_node/?level=0&page=1&page_size=100`)
      .then(response => response.json())
      .then(data => data.results)
  );

  const setInitialServices = () => {
    // Fetch initially shown service nodes when first entering the page
    fetchRootNodes()
      .then(data => setTreeSerivces(data));
  };

  const fetchChildNodes = async service => (
    fetch(`${config.serviceMapAPI.root}/service_node/?parent=${service}&page=1&page_size=1000`)
      .then(response => response.json())
      .then(data => data.results));


  const getSelectedParentNodes = (item, data = []) => {
    if (item.parent) {
      const checkdedParent = selected.find(e => e.id === item.parent && e.name);
      if (checkdedParent) {
        data.push(checkdedParent.id);
        if (checkdedParent.parent) {
          getSelectedParentNodes(checkdedParent, data);
        } else {
          return data;
        }
        return data;
      }
    }
    return [];
  };

  const getSelectedChildNodes = (item, data = []) => {
    // Loop through each checked child node and their checked childs
    let child = item;
    if (typeof item === 'number') {
      child = selected.find(e => e.id === item);
    }
    if (child && child.children) {
      data.push(...child.children);
      child.children.forEach((c) => {
        getSelectedChildNodes(c, data);
      });
    } return data;
  };


  const getRecursiveChildNodes = async (node) => {
    // Repeat this function recursively on child nodes
    if (!node.children.length) return [];
    return fetchChildNodes(node.id)
      .then(children => Promise.all(children.map(node => getRecursiveChildNodes(node)))
        .then((results) => {
          const combindedResults = [].concat(...results);
          return [...children, ...combindedResults];
        }));
  };

  const handleChildNodeFetch = (node) => {
    // Fetch all child nodes recursively until all levels are fetched
    dispatchNodeFetch({ type: 'start', fetching: node.id });
    getRecursiveChildNodes(node)
      .then((data) => {
        dispatchNodeFetch({ type: 'complete', data, fetching: node.id });
        setTreeOpened([...opened, node.id]);
        if (selected.includes(node.id) || checkParents(selected, node.id)) {
          setTreeSelected([...selected, ...data.map(item => item.id)]);
        }
      })
      .catch((e) => {
        console.warn(e);
        dispatchNodeFetch({ type: 'end', fetching: node.id });
      });
  };

  const handleExpand = (service, isOpen) => {
    if (isOpen) { // Close expanded item
      setTreeOpened(opened.filter(e => e !== service.id));
    } else if (services.some(e => e.parent === service.id)) { // Expand item without fetching
      setTreeOpened([...opened, service.id]);
    } else { // Fetch all child nodes then expand
      handleChildNodeFetch(service);
    }
  };

  const handleCheckboxClick = (e, item) => {
    // If checbox is already checked, remove checkbox selections
    if (selected.includes(item.id)) {
      const parentsToRemove = getSelectedParentNodes(item);
      const childrenToRemove = getSelectedChildNodes(item);
      const nodesToRemove = [...parentsToRemove, ...childrenToRemove];
      // Remove nodes from selected state
      if (nodesToRemove.length) {
        setTreeSelected(
          selected.filter(element => element !== item.id && !nodesToRemove.includes(element)),
        );
      } else {
        setTreeSelected(selected.filter(element => element !== item.id));
      }

    // If checbox is not checked, add checkbox selections
    } else {
      // Select all visible child nodes as well
      let newState = [item.id, ...checkChildNodes(item)];

      // If all other sibling nodes are selected too, select parent node as well
      const parent = services.find(service => service.id === item.parent);
      if (parent && parent.children.every(child => [...selected, item.id].includes(child))) {
        newState = [...newState, parent.id];
      }

      // Filter duplicates
      newState = newState.filter(e => !selected.includes(e));
      e.stopPropagation();
    }
  };

  const drawCheckboxLines = (isOpen, level, id) => {
    const paths = [];
    let strokeColor = '#000';

    if (isOpen) {
      paths.push('M 20 38 V 60');
    }
    if (level > 0) {
      strokeColor = '#323232';
      paths.push('M 0 30 H 12');
    }

    const line = paths.join(' ');

    return (
      <svg key={`innerLine${id}`} className={classes.checkBoxLines}>
        <path d={line} stroke={strokeColor} fill="transparent" />
      </svg>
    );
  };

  const generateDrawPath = (last, bottom, i, id) => {
    const currentLast = last.includes(i);
    if (!bottom && currentLast) {
      return null;
    }
    if (bottom && currentLast) {
      return <path key={`outerPath${id}`} d="M 20 0 V 30 H 26" stroke="black" fill="transparent" />;
    }
    if (bottom && !currentLast) {
      return <path key={`outerPath${id}`} d="M 20 0 V 60 M 20 30 H 26" stroke="black" fill="transparent" />;
    }
    return <path key={`outerPath${id}`} d="M 20 0 V 60" stroke="black" fill="transparent" />;
  };

  const drawOuterLines = (level, last, id) => (
    [...Array(level)].map((none, i) => (
      <svg key={`outerLine${level + i}`} className={classes.outerLines}>
        {generateDrawPath(last, level === i + 1, i, id)}
      </svg>
    ))
  );

  useEffect(() => {
    if (!services.length) {
      setInitialServices();
    }
  }, []);

  useEffect(() => {
    // Resolve child service node fetch, once all fetches are complete
    if (!nodeData.fetching.length && nodeData.data.length) {
      const newArray = nodeData.data.filter(
        result => !services.some(service => service.id === result.id),
      );
      if (newArray.length) {
        setTreeSerivces([...services, ...newArray]);
      }
    }
  }, [nodeData]);

  const expandingComponent = (item, level, last = []) => {
    const hasChildren = item.children.length;
    const isOpen = opened.includes(item.id);
    const children = hasChildren ? services.filter(e => e.parent === item.id) : null;
    const icon = isOpen
      ? <ArrowDropUp className={classes.iconRight} />
      : <ArrowDropDown className={classes.iconRight} />;

    let resultCount = 0;

    if (!citySettings.length || citySettings.length === config.cities.length) {
      resultCount = item.unit_count.total;
    } else {
      config.cities.forEach((city) => {
        resultCount += (settings.cities[city] ? item.unit_count.municipality[city] || 0 : 0);
      });
    }

    const checkboxSrTitle = `${intl.formatMessage({ id: 'services.tree.level' })} ${level + 1} ${getLocaleText(item.name)} ${intl.formatMessage({ id: 'services.category.select' })}`;
    const itemSrTitle = `${getLocaleText(item.name)} (${resultCount}) ${intl.formatMessage({ id: 'services.category.open' })}`;

    const isSelected = selected.includes(item.id);

    // Check if any child or grandchild node is checked, so we can display indeterminate mark.
    const childIsSelected = checkChildNodes(item)
      .some(node => selected.includes(node));

    return (
      <React.Fragment key={item.id}>
        <ListItem
          disableGutters
          className={`${classes.listItem} ${classes[`level${level}`]}`}
        >
          {level > 0 && (drawOuterLines(level, last, item.id))}

          <div className={classes.checkBox}>
            {drawCheckboxLines(isOpen, level, item.id)}
            <Checkbox
              className={classes.checkboxPadding}
              inputProps={{ title: checkboxSrTitle }}
              onClick={e => handleCheckboxClick(e, item)}
              icon={<span className={classes.checkBoxIcon} />}
              color="primary"
              checked={isSelected}
              indeterminate={childIsSelected && !isSelected}
            />
          </div>

          <ButtonBase
            aria-expanded={!hasChildren ? null : isOpen}
            className={classes.listClickArea}
            disabled={!hasChildren}
            disableRipple
            disableTouchRipple
            onClick={hasChildren ? () => handleExpand(item, isOpen) : null}
            aria-label={itemSrTitle}
          >
            <Typography align="left" className={classes.text}>
              {nodeData.fetching.includes(item.id)
                ? <FormattedMessage id="general.loading" />
                : `${getLocaleText(item.name)} (${resultCount})`
              }
            </Typography>
            {hasChildren ? icon : <span className={classes.iconRight} />}
          </ButtonBase>

        </ListItem>

        <Collapse aria-hidden={!isOpen} in={isOpen}>
          {isOpen && children && children.length ? children.map((child, i) => (
            expandingComponent(
              child, // child service node
              level + 1, // child node level
              // If this node is last of its level, add to list (this helps the drawing of lines)
              i + 1 === children.length ? [...last, level] : last,
            )
          )) : null}
        </Collapse>
      </React.Fragment>
    );
  };

  // Render components:

  const renderServiceNodeList = () => (
    <List role="list" disablePadding>
      {services && services.map(service => (
        !service.parent && (
          expandingComponent(service, 0)
        )
      ))}
    </List>
  );

  const renderSelectedCities = () => {
    const cityString = citySettings.join(', ');
    return (
      <NoSsr>
        <div className={classes.infoContainer}>
          {citySettings.length ? (
            <>
              <Typography className={`${classes.infoText} ${classes.bold}`}>
                <FormattedMessage id="settings.city.info" values={{ count: citySettings.length }} />
                : &nbsp;
              </Typography>
              <Typography className={classes.infoText}>
                {cityString}
              </Typography>
            </>
          ) : null}
        </div>
      </NoSsr>
    );
  };

  const renderSelectionList = selectedList => (
    <>
      <div className={classes.infoContainer}>
        <ButtonBase
          aria-expanded={selectedOpen}
          disabled={!selectedList.length}
          onClick={() => setSelectedOpen(!selectedOpen)}
          className={classes.selectionsButton}
          focusVisibleClassName={classes.selectionFocus}
        >
          <Typography className={`${classes.selectionText} ${classes.bold}`}>
            <FormattedMessage id="services.selections" values={{ count: selectedList.length }} />
          </Typography>
          {selectedOpen
            ? <ArrowDropUp className={classes.white} />
            : <ArrowDropDown className={classes.white} />}
        </ButtonBase>

        {selectedList.length ? (
          <ButtonBase
            className={classes.right}
            disabled={!selectedList.length}
            onClick={() => setSelected([])}
            focusVisibleClassName={classes.selectionFocus}
          >
            <Typography className={classes.deleteText}>
              <FormattedMessage id="services.selections.delete.all" />
            </Typography>
            <Cancel className={classes.deleteIcon} />
          </ButtonBase>
        ) : null}
      </div>
      <Divider aria-hidden className={classes.whiteDivider} />

      <Collapse aria-hidden={!selectedOpen} in={selectedOpen}>
        {selectedOpen && (
        <List className={classes.seleectionList} disablePadding>
          {selectedList.map(item => (
            item.name && (
              <ListItem dense key={item.id} disableGutters>
                <Typography className={classes.selectionText} aria-hidden variant="body2">
                  {getLocaleText(item.name)}
                </Typography>
                <ButtonBase
                  className={classes.right}
                  aria-label={intl.formatMessage({ id: 'services.selections.delete.sr' }, { service: getLocaleText(item.name) })}
                  onClick={() => handleCheckboxClick(null, item)}
                  focusVisibleClassName={classes.selectionFocus}
                >
                  <Typography className={classes.deleteText} variant="body2">
                    <FormattedMessage id="services.selections.delete" />
                  </Typography>
                  <Cancel className={classes.deleteIcon} />
                </ButtonBase>
              </ListItem>
            )
          ))}
        </List>
        )}
        {selectedList.length ? <Divider aria-hidden className={classes.whiteDivider} /> : null}
      </Collapse>
    </>
  );

  const renderSearchButton = (selectedList) => {
    const ids = selectedList.map(i => i.id);
    const selectedString = selectedList.map(i => getLocaleText(i.name)).join(', ');
    return (
      <SMButton
        aria-label={selectedList.length
          ? intl.formatMessage({ id: 'services.search.sr.selected' }, { services: selectedString })
          : intl.formatMessage({ id: 'services.search.sr' })}
        margin
        className={classes.searchButton}
        disabled={!selectedList.length}
        icon={<Search />}
        messageID="services.search"
        onClick={() => {
          setTreeState({ services, selected, opened });
          navigator.push('search', { service_node: ids });
        }}
        role="link"
      />
    );
  };


  // If node's parent is also checked, add only parent to list of selected nodes for search
  const selectedList = [];
  selected.forEach((e) => {
    const node = services.find(item => item.id === e);
    if (!selected.includes(node.parent)) {
      selectedList.push(e);
    }
  });

  return (
    <>
      <div className={classes.topArea}>
        <Typography aria-hidden className={classes.title}><FormattedMessage id="services" /></Typography>
        {renderSelectedCities()}
        {renderSelectionList(selectedList)}
      </div>
      <div className={classes.mainContent}>
        {renderSearchButton(selectedList)}
        {renderServiceNodeList()}
      </div>
    </>
  );
};

ServiceTreeView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  setTreeState: PropTypes.func.isRequired,
  prevServices: PropTypes.arrayOf(PropTypes.any),
  prevSelected: PropTypes.arrayOf(PropTypes.any),
  prevOpened: PropTypes.arrayOf(PropTypes.any),
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

ServiceTreeView.defaultProps = {
  navigator: null,
  prevServices: [],
  prevSelected: [],
  prevOpened: [],
};

export default ServiceTreeView;
