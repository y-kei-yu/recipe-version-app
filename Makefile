.PHONY: dev test build check

dev:
	npm run dev

test:
	npm run test

build:
	npm run build

check:
	npm run lint
	npx next typegen && npx tsc --noEmit
	make test
	make build
