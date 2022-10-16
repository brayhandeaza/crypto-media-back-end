main-server:
	cd main && docker build -t main-server . && .. 

coins-server:
	cd coins && docker build -t coins-server . && ..

notifications-server:
	cd notifications && docker build -t notifications-server . && ..

run-servers:
	docker compose up

remove-servers:
	docker compose rm -f