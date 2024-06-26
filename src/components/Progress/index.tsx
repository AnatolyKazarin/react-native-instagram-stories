import React, { FC, memo } from 'react';
import { View } from 'react-native';
import ProgressItem from './item';
import { WIDTH } from '../../core/constants';
import ProgressStyles from './Progress.styles';
import { StoryProgressProps } from '../../core/dto/componentsDTO';

const Progress: FC<StoryProgressProps> = ( {
  progress, active, activeStory, length,
  progressActiveColor, progressColor
} ) => {

  const width = ( (WIDTH - 32) - ( length - 1 ) * ProgressStyles.container.gap ) / length;

  return (
    <View style={[ ProgressStyles.container, { width: WIDTH } ]}>
      {[ ...Array( length ).keys() ].map( ( val ) => (
        <ProgressItem
          active={active}
          activeStory={activeStory}
          progress={progress}
          index={val}
          width={width}
          key={val}
          progressActiveColor={progressActiveColor}
          progressColor={progressColor}
        />
      ) )}
    </View>
  );

};

export default memo( Progress );
