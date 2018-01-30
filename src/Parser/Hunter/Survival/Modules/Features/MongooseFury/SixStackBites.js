import React from 'react';

import SPELLS from 'common/SPELLS/index';
import Analyzer from 'Parser/Core/Analyzer';
import StatisticBox from 'Main/StatisticBox';
import SpellIcon from 'common/SpellIcon';
import STATISTIC_ORDER from 'Main/STATISTIC_ORDER';
import { formatNumber } from 'common/format';

const MAX_STACKS = 6;

class SixStackBites extends Analyzer {

  _currentStacks = 0;
  totalWindowsStarted = 0;
  sixBiteWindows = 0;
  sixBiteWindowBites = 0;
  totalBites = 0;

  on_byPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.MONGOOSE_FURY.id) {
      return;
    }
    this._currentStacks = 1;
    this.totalWindowsStarted++;
  }

  on_byPlayer_applybuffstack(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.MONGOOSE_FURY.id) {
      return;
    }
    this._currentStacks = event.stack;
    if (this._currentStacks === MAX_STACKS) {
      this.sixBiteWindows++;
    }
  }

  on_byPlater_removebuff(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.MONGOOSE_FURY.id) {
      return;
    }
    this._currentStacks = 0;
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.MONGOOSE_BITE.id) {
      return;
    }
    this.totalBites++;
    if (this._currentStacks === MAX_STACKS) {
      this.sixBiteWindowBites += 1;
    }
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.MONGOOSE_FURY.id} />}
        value={`${this.sixBiteWindowBites}/${this.totalBites}`}
        label="6 stack bites"
        tooltip={`<ul><li>You hit an average of ${(this.sixBiteWindowBites / this.sixBiteWindows).toFixed(1)} bites when you had 6 stacks of Mongoose Fury. </li><li>You hit an average of ${(this.totalBites / this.totalWindowsStarted).toFixed(1)} bites per Mongoose Fury window started.</li></ul> `} />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(6);
}

export default SixStackBites;
