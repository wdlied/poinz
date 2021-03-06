import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {addStory} from '../../actions';
import {STORY_DESCRIPTION_MAX_LENGTH, STORY_TITLE_REGEX} from '../frontendInputValidation';
import {hasMatchingPendingCommand} from '../../services/selectors';
import ValidatedInput from '../common/ValidatedInput';

import {StyledAddForm} from './_styled';

/**
 * Form for adding stories to the backlog
 */
const StoryAddForm = ({t, addStory, waiting}) => {
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescr, setStoryDescr] = useState('');

  return (
    <StyledAddForm
      data-testid="storyAddForm"
      className={`pure-form ${waiting ? 'waiting-spinner' : ''}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <fieldset className="pure-group">
        <ValidatedInput
          type="text"
          className="pure-input-1"
          placeholder={t('storyTitle')}
          fieldValue={storyTitle}
          setFieldValue={setStoryTitle}
          regexPattern={STORY_TITLE_REGEX}
          onEnter={triggerAddAndClearForm}
        />

        <textarea
          className="pure-input-1"
          rows="1"
          placeholder={t('description')}
          value={storyDescr}
          onChange={onDescriptionChange}
        />
      </fieldset>

      <button
        type="button"
        className="pure-button pure-input-1 pure-button-primary"
        onClick={triggerAddAndClearForm}
      >
        {t('addStory')}
        <i className="icon-plus button-icon-right"></i>
      </button>
    </StyledAddForm>
  );

  function onDescriptionChange(ev) {
    const val = ev.target.value;
    if (val.length <= STORY_DESCRIPTION_MAX_LENGTH) {
      setStoryDescr(val);
    }
  }

  function triggerAddAndClearForm() {
    if (storyTitle) {
      addStory(storyTitle, storyDescr);
      setStoryTitle('');
      setStoryDescr('');
    }
  }
};

StoryAddForm.propTypes = {
  t: PropTypes.func,
  addStory: PropTypes.func,
  waiting: PropTypes.bool
};

export default connect(
  (state) => ({
    t: state.translator,
    waiting: hasMatchingPendingCommand(state, 'addStory')
  }),
  {addStory}
)(StoryAddForm);
