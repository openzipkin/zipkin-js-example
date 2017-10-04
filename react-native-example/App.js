import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tracer, ExplicitContext, BatchRecorder } from 'zipkin';
import wrapFetch from 'zipkin-instrumentation-fetch';
import { HttpLogger } from 'zipkin-transport-http';

const HOST = 'http://192.168.178.20:9411'

export default class App extends React.Component {
  state = {
    person: 'Not loaded',
    fetch: wrapFetch(fetch, {
      tracer: new Tracer({
        ctxImpl: new ExplicitContext(),
        recorder: new BatchRecorder({
          logger: new HttpLogger({
            endpoint: `${HOST}/api/v1/spans`,
            fetch,
          }),
        }),
      }),
      remoteServiceName: 'StarWars',
    }),
  };

  componentWillMount() {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    this.state.fetch("https://swapi.co/api/people/" + randomNumber)
      .then(response => response.json())
      .then(person => this.setState({
        person: person.name,
      })
      ).catch(e => console.error(e));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.person}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});