import React, {Component} from "react";
import {View, Alert, ListView, Linking, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {AppColors, AppStyles} from "@theme/";
import {Alerts, Button, Card, Spacer, Text, List, ListItem, FormInput, FormLabel} from "@components/ui/";
import Loading from '@components/general/Loading';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

const styles = StyleSheet.create({});

class LinkView extends Component {
  static componentName = 'LinkView';

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      links: [],
      dataUrl: 'http://99.12.195.70:8000/api/link/',
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({
      loading: true,
      canLoadMoreContent: false
    });

    if(!this.state.dataUrl){
      return;
    }

    fetch(this.state.dataUrl, {
      method: 'get',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        this.setState({
          loading: false,
          dataSource: this.updatedDataSource(responseData.results),
        });

        if (!responseData.next) {
          this.setState({
            dataUrl: responseData.next,
            canLoadMoreContent: true
          })
        }
      })
  }

  updatedDataSource(data) {
    this.setState({
      links: this.state.links.concat(data)
    });

    return this.state.dataSource.cloneWithRows(this.state.links);
  }

  onLoadMoreAsync = () => {
    var that = this;
    this.setState({isLoadMoreAsync: true});
    this.fetchData().then(function(){
      that.setState({isLoadMoreAsync: false});
    })
  };

  onPress(url) {
    Linking.openURL(url);
  }

  render = () => {
    if (this.state.loading) {
      return <Loading />
    }
    const { dataSource, canLoadMoreContent } = this.state;

    return (
      <ScrollView automaticallyAdjustContentInsets={false} style={[AppStyles.container]}>
        <ListView
          initialListSize={10}
          renderScrollComponent={props => <InfiniteScrollView {...props} />}
          renderRow={link =>
            <TouchableOpacity onPress={this.onPress.bind(this, link.link)}>
            <Card>
              <View>
                <Text>{link.title}</Text>
              </View>
            </Card>
            </TouchableOpacity>
          }
          dataSource={dataSource}
          canLoadMore={canLoadMoreContent}
          onLoadMoreAsync={this.onLoadMoreAsync}
        />

      </ScrollView>
    )
  };
}

export default LinkView;
