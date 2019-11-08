import React, { PureComponent, Fragment } from 'react';
import { Icon, Grid, Modal } from 'semantic-ui-react';
import Footer from 'components/layouts/Footer';
import { connect } from 'react-redux';
import { searchLocationBy } from 'actions/LocationAction';
import { SIDE_PANEL_STEP } from 'constants/SidePanelStep';
import { CATEGORY_TYPES } from 'constants/Category';
import { updatePropsApp } from 'actions/PropsAppAction';

import './InputSearch.scss';

class InputSearch extends PureComponent {
  constructor() {
    super();
    this.state = {
      searchValue: '',
      isFocus: false
    };
    this.changeStatusSearch = this.changeStatusSearch.bind(this);
    this.handleInputSearch = this.handleInputSearch.bind(this);
    this.renderSearchOnDesktop = this.renderSearchOnDesktop.bind(this);
    this.renderSearchOnSP = this.renderSearchOnSP.bind(this);
    this.renderListResults = this.renderListResults.bind(this);
    this.handleShowListCardResearch = this.handleShowListCardResearch.bind(
      this
    );
    this.handleClickDetailResult = this.handleClickDetailResult.bind(this);
  }

  changeStatusSearch(e) {
    e.preventDefault();
    const { isFocus, searchValue } = this.state;
    this.setState({
      searchValue: isFocus ? '' : searchValue,
      isFocus: !isFocus
    });
  }

  handleInputSearch(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(searchLocationBy({ header: e.target.value }));
    this.setState({
      searchValue: e.target.value,
      isFocus: true
    });
  }

  handleShowListCardResearch(searchResults) {
    const { onChangeStep, dispatch } = this.props;
    this.setState({
      searchValue: '',
      isFocus: false
    });
    onChangeStep(SIDE_PANEL_STEP.LIST_CARD, {
      locations: searchResults
    });
    dispatch(
      updatePropsApp({
        currentHeader: CATEGORY_TYPES.SEARCH_HEADER
      })
    );
  }

  handleClickDetailResult(_id, searchResults) {
    const { onChangeStep, dispatch } = this.props;
    this.setState({
      searchValue: '',
      isFocus: false
    });
    onChangeStep(SIDE_PANEL_STEP.DETAIL, {
      _id,
      locations: searchResults
    });
    dispatch(
      updatePropsApp({
        currentHeader: CATEGORY_TYPES.SEARCH_HEADER
      })
    );
  }

  renderListResults(searchValue) {
    if (_.isEmpty(searchValue)) return null;

    const { searchResults } = this.props;
    const elmResult = [];

    searchResults.forEach(item => {
      const { _id } = item;
      elmResult.push(
        <Grid.Row
          key={Math.random()}
          onClick={() => this.handleClickDetailResult(_id, searchResults)}
        >
          <Grid.Column width={2}>
            <Icon name='map marker alternate' circular />
          </Grid.Column>
          <Grid.Column width={14}>
            <div className='item-header'>{item.header}</div>
            <div className='item-info'>{item.author}</div>
          </Grid.Column>
        </Grid.Row>
      );
    });
    return (
      <Fragment>
        <div className='list-result'>
          {_.isEmpty(elmResult) ? (
            <div className='message empty'>
              <div className='header'>No results found.</div>
            </div>
          ) : (
            <Grid divided='vertically'>
              <Grid.Row
                className='show-list-card'
                onClick={() => this.handleShowListCardResearch(searchResults)}
              >
                <Grid.Column width={2}>
                  <Icon name='search' circular />
                </Grid.Column>
                <Grid.Column width={14}>
                  <div className='item-header'>
                    <p>{searchValue}</p>
                  </div>
                </Grid.Column>
              </Grid.Row>
              {elmResult}
            </Grid>
          )}
        </div>
      </Fragment>
    );
  }

  renderSearchOnDesktop() {
    const { isFocus, searchValue } = this.state;
    const nameIcon = isFocus ? 'x' : 'search';
    return (
      <div className='pc'>
        <div className='ui icon input'>
          <input
            type='search'
            value={searchValue}
            className='prompt'
            autoComplete='off'
            placeholder='Location/Keyword Search'
            onChange={this.handleInputSearch}
          />
          <Icon
            link
            name={nameIcon}
            aria-hidden='true'
            onClick={this.changeStatusSearch}
          />
        </div>
        <div className={`results transition${isFocus ? ' active' : ''}`}>
          {this.renderListResults(searchValue)}
        </div>
        <Footer />
      </div>
    );
  }

  renderSearchOnSP() {
    const { searchValue, isFocus } = this.state;
    return (
      <div className='sp'>
        <div className='ui icon input'>
          <input
            type='text'
            value={searchValue}
            className='prompt'
            autoComplete='off'
            placeholder='Location/Keyword Search'
            onChange={this.handleInputSearch}
          />
          <Icon link name='search' aria-hidden='true' />
        </div>
        <Modal className='sp-modal-search' open={isFocus}>
          <Modal.Header>
            <div className='back'>
              <Icon name='arrow left' onClick={this.changeStatusSearch} />
              <span>Back</span>
            </div>
            <div className='column-search'>
              <div className='ui icon input'>
                <input
                  type='text'
                  value={searchValue}
                  className='prompt'
                  autoComplete='off'
                  placeholder='Location/Keyword Search'
                  onChange={this.handleInputSearch}
                />

                <Icon
                  link
                  name='x'
                  aria-hidden='true'
                  onClick={this.changeStatusSearch}
                />
              </div>
            </div>
          </Modal.Header>
          <Modal.Content>{this.renderListResults(searchValue)}</Modal.Content>
        </Modal>
      </div>
    );
  }

  render() {
    const { isFocus } = this.state;
    const { isDesktop } = this.props;
    return (
      <div className={`search-input${isFocus ? ' active' : ''}`}>
        {isDesktop ? this.renderSearchOnDesktop() : this.renderSearchOnSP()}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  searchResults: state.LocationReducer.searchResults || []
});
export default connect(mapStateToProps)(InputSearch);
