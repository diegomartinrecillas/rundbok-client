import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Search from '../../components/search/Search';

import { SearchProvider } from '../../contexts/Search.context';

const Home = () => {
	return (
		<SearchProvider>
			<div className="row">
				<div className="col-lg-3 border-right">
					<Sidebar />
				</div>
				<div className="col-lg-9">
					<Search />
				</div>
			</div>
		</SearchProvider>
	);
};

export default Home;
