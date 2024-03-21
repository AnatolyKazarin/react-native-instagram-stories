import { Image, View, SafeAreaView, BackgroundImage } from 'react-native';
import React, { FC, memo, useState } from 'react';
import {
  runOnJS, useAnimatedReaction, useDerivedValue, useSharedValue,
} from 'react-native-reanimated';
import { StoryImageProps } from '../../core/dto/componentsDTO';
import Loader from '../Loader';
import { HEIGHT, LOADER_COLORS, WIDTH } from '../../core/constants';
import ImageStyles from './Image.styles';
import StoryVideo from './video';
import {LinearGradient} from 'expo-linear-gradient';

const StoryImage: FC<StoryImageProps> = ( {
  children, stories, activeStory, defaultImage, isDefaultVideo, paused, videoProps, isActive,
  mediaContainerStyle, imageStyles, imageProps, onImageLayout, onLoad,
} ) => {

  const [ data, setData ] = useState<{ uri: string | undefined, isVideo?: boolean }>(
    { uri: defaultImage, isVideo: isDefaultVideo },
  );

  const loading = useSharedValue( true );
  const color = useSharedValue( LOADER_COLORS );
  const videoDuration = useSharedValue<number | undefined>( undefined );
  const isPaused = useDerivedValue( () => paused.value || !isActive.value );

  const onImageChange = async () => {

    if ( !activeStory.value ) {

      return;

    }

    const story = stories.find( ( item ) => item.id === activeStory.value );

    if ( !story ) {

      return;

    }

    if ( data.uri === story.sourceUrl ) {

      if ( !loading.value ) {

        onLoad( videoDuration.value );

      }

    } else {

      loading.value = true;
      setData( { uri: story.sourceUrl, isVideo: story.mediaType === 'video' } );

    }

    const nextStory = stories[stories.indexOf( story ) + 1];

    if ( nextStory && nextStory.mediaType !== 'video' ) {

      Image.prefetch( nextStory.sourceUrl );

    }

  };

  useAnimatedReaction(
    () => isActive.value,
    ( res, prev ) => res !== prev && res && runOnJS( onImageChange )(),
    [ isActive.value ],
  );

  useAnimatedReaction(
    () => activeStory.value,
    ( res, prev ) => res !== prev && runOnJS( onImageChange )(),
    [ activeStory.value ],
  );

  const onContentLoad = ( duration?: number ) => {

    if ( data.isVideo ) {

      videoDuration.value = duration;

    }

    loading.value = false;

    if ( isActive.value ) {

      onLoad( duration );

    }

  };

  return (
    <>
      <View style={ImageStyles.container}>
        <Loader loading={loading} color={color} size={50} />
      </View>
      <View style={[ ImageStyles.image, mediaContainerStyle ]}>
        {data.uri && (
          data.isVideo ? (
            <StoryVideo
              onLoad={onContentLoad}
              onLayout={onImageLayout}
              uri={data.uri}
              paused={isPaused}
              isActive={isActive}
              {...videoProps}
            />
          ) : (
            <BackgroundImage
              source={{ uri: data.uri }}
              style={[ {flex: 1, width: WIDTH, aspectRatio: 0.5626 }, imageStyles ]}
              testID="storyImageComponent"
              onLayout={( e ) => onImageLayout( Math.min( HEIGHT, e.nativeEvent.layout.height ) )}
              onLoad={() => onContentLoad()}
              {...imageProps}
            >
              <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,1)']}
                  locations={[0, 0.8]}
                  style={{width: WIDTH, flex: 1}}>
                <SafeAreaView style={{flex: 1}}>
                  {children}
                </SafeAreaView>
              </LinearGradient>
            </BackgroundImage>

          )
        )}
      </View>
    </>
  );

};

export default memo( StoryImage );
