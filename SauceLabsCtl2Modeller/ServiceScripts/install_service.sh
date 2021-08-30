sudo mkdir /etc/ModellerExecutionEngine

sudo cp modeller_job_engine.service /etc/systemd/system/job_engine.service
sudo systemctl daemon-reload

sudo systemctl enable job_engine

sudo systemctl start job_engine

sudo systemctl status job_engine



