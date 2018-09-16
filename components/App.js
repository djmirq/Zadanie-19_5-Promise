var GIPHY_API_URL = "http://api.giphy.com";
var GIPHY_PUB_KEY = "rHS4Ox7YIE4GNBXOQLsad8XhZ0JyaL6D";
// var gif = 'kurza.gif'
App = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchingText: "",
      gif: {}
    };
  },

  handleSearch: function(searchingText) {
    // 1.
    this.setState({
      loading: true // 2.
    });
    this.getGif(
      GIPHY_API_URL +
        "/v1/gifs/random?api_key=" +
        GIPHY_PUB_KEY +
        "&tag=" +
        searchingText
    )
      .then(
        function(datums) {
          var data = JSON.parse(datums).data;
          var gif = {
            url: data.fixed_width_downsampled_url,
            sourceUrl: data.url
          };
          this.setState({
            loading: false,
            gif: gif,
            searchingText: searchingText
          });
        }.bind(this)
      )
      .catch(
        function(err) {
          console.log(err.statusText);
          var gif = {
            url: "http://mrw.blox.pl/resource/failchrome.gif",
            sourceUrl: "http://mrw.blox.pl/resource/failchrome.gif"
          };
          this.setState({
            loading: false,
            gif: gif,
            searchingText: searchingText
          });
        }.bind(this)
      );
  },
 
  getGif: function(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function() {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  },

  render: function() {
    var styles = {
      margin: "0 auto",
      textAlign: "center",
      width: "90%"
    };

    return (
      <div style={styles}>
        <h1>Wyszukiwarka GIFow!</h1>
        <p>
          Znajdź gifa na <a href="http://giphy.com">giphy</a>. Naciskaj enter,
          aby pobrać kolejne gify.
        </p>
        <Search onSearch={this.handleSearch} />
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  }
});
