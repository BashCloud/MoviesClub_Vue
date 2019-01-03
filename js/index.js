new Vue({
    el: '#app',
    data: function data() {
        return {
            search: '',
            sort: '',
            movies: [],
            pageNumber: 0,
            pageSize: 6,
            pageCount: 10,
        };
    },
    mounted() {
        var localMovies = localStorage.getItem('movies');
        if (localMovies) {
            this.movies = JSON.parse(localMovies);
            console.log("Fetching data from local storage...");
        } else {
            axios.get("http://starlord.hackerearth.com/movieslisting")
                .then(response => {
                    this.movies = response.data;
                    localStorage.setItem('movies', JSON.stringify(this.movies));
                })
        }
        if(this.movies.length === 0){
            fetch("Movies.json")
                .then(response => response.json())
                .then(json => {
                    this.movies = json;
                });
        }
    },
    methods: {
        nextPage() {
            if (this.pageNumber < this.pageCount)
                this.pageNumber++;
        },
        prevPage() {
            if (this.pageNumber > 1)
                this.pageNumber--;
        }
    },
    computed: {
        getMovies() {
            var _this = this;
            var movies = this.movies.filter(function(movie) {
                return movie.movie_title.toLowerCase().includes(_this.search.toLowerCase());
            });
            if (this.sort == 'score') {
                movies = movies.sort(function(a, b) {
                    return b.score - a.score;
                });
            }
            this.pageCount = Math.floor(movies.length / this.pageSize);
            if (this.pageNumber > this.pageCount)
                this.pageNumber = this.pageCount;
            var startIndex = this.pageNumber * this.pageSize;
            var endIndex = startIndex + this.pageSize;
            return movies.slice(startIndex, endIndex);
        }
    },
    filters: { //To generate Icon
        firstChar: function(str) {
            var strs = str.split(" ");
            var msg2 = (strs.length > 1) ? strs[1].charAt(0) : '';
            return strs[0].charAt(0) + msg2;
        }
    }
});
